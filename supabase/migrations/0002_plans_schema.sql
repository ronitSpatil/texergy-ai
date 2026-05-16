-- Plans ingestion schema.
--
-- All tables ship with RLS enabled and zero policies, matching the waitlist
-- table's deny-by-default posture. Reads/writes go through the server using
-- the service-role key (or, for user-facing reads later, via authenticated
-- views/policies added in a follow-up migration).

------------------------------------------------------------------------
-- 1. Retail Electric Providers (REPs) — ~150 companies in Texas
------------------------------------------------------------------------
create table public.reps (
  id               bigint generated always as identity primary key,
  name             text        not null unique,
  slug             text        not null unique,
  ptc_company_id   text        unique,        -- PTC opaque ID, e.g. "ELSQL01DB1245252700002"
  puct_number      text        unique,        -- PUCT REP certification #, harvested from EFLs later
  website_url      text,
  logo_url         text,
  phone            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

------------------------------------------------------------------------
-- 2. Transmission & Distribution Utilities (TDUs) — the 5 wires companies
------------------------------------------------------------------------
create table public.tdus (
  id          bigint generated always as identity primary key,
  code        text        not null unique,   -- "ONCOR", "CENTERPOINT", "AEP_CENTRAL", "AEP_NORTH", "TNMP"
  name        text        not null unique,
  ptc_tdu_id  text        unique,            -- PTC opaque ID, e.g. "ELSQL01DB1245281100002"
  duns        text        unique,            -- DUNS — populated later from EFL data
  created_at  timestamptz not null default now()
);

-- Seed the five Texas TDUs. These don't change. ptc_tdu_id and duns get
-- backfilled by the first ingest run (we match on tdu name from the API).
insert into public.tdus (code, name) values
  ('ONCOR',       'Oncor Electric Delivery'),
  ('CENTERPOINT', 'CenterPoint Energy Houston'),
  ('AEP_CENTRAL', 'AEP Texas Central'),
  ('AEP_NORTH',   'AEP Texas North'),
  ('TNMP',        'Texas-New Mexico Power');

------------------------------------------------------------------------
-- 3. Service areas — ZIP → TDU mapping (some ZIPs split across 2 TDUs)
------------------------------------------------------------------------
create table public.service_areas (
  zip        text   not null,
  tdu_id     bigint not null references public.tdus(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (zip, tdu_id)
);
create index idx_service_areas_zip on public.service_areas (zip);

------------------------------------------------------------------------
-- 4. Plans — one row per active offer (and soft-deleted historical ones)
------------------------------------------------------------------------
create table public.plans (
  id                      bigint generated always as identity primary key,
  ptc_id                  text        not null unique,   -- PTC's plan_id (e.g. "33610")
  rep_id                  bigint      not null references public.reps(id),
  tdu_id                  bigint      references public.tdus(id),

  name                    text        not null,
  rate_type               text,                            -- "Fixed" / "Variable" / "Indexed" (PTC's rate_type)
  plan_type_code          int,                             -- PTC's plan_type int (0/1/2…); resolve via /plans/types
  term_months             int,                             -- PTC's term_value, null for month-to-month
  prepaid                 boolean     not null default false,
  prepaid_url             text,
  new_customer_only       boolean     not null default false,
  time_of_use             boolean     not null default false,
  simple_plan             boolean     not null default false,
  has_minimum_usage_fee   boolean     not null default false,
  renewable_pct           int         check (renewable_pct between 0 and 100),

  -- Headline rates from PTC at standard usage tiers, in cents/kWh.
  -- Stored as numeric(7,4) so we keep PTC's precision without floating-point drift.
  rate_500_kwh            numeric(7,4),
  rate_1000_kwh           numeric(7,4),
  rate_2000_kwh           numeric(7,4),

  efl_url                 text,                            -- Electricity Facts Label PDF (fact_sheet)
  tos_url                 text,                            -- Terms of Service PDF
  yrac_url                text,                            -- Your Rights as a Customer PDF
  enroll_url              text,                            -- PTC's go_to_plan link

  -- Raw text blobs from PTC; superseded by parsed plan_details once EFL parser runs.
  special_terms           text,
  pricing_details_raw     text,
  promotions              text,

  -- Soft-delete via active flag rather than DELETE — keeps history queryable.
  active                  boolean     not null default true,
  first_seen_at           timestamptz not null default now(),
  last_seen_at            timestamptz not null default now(),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index idx_plans_active_term     on public.plans (active, term_months);
create index idx_plans_rep             on public.plans (rep_id);
create index idx_plans_tdu             on public.plans (tdu_id);
create index idx_plans_renewable       on public.plans (renewable_pct) where active;
create index idx_plans_rate1000        on public.plans (rate_1000_kwh) where active;

------------------------------------------------------------------------
-- 5. Plan details — parsed EFL contents, one row per plan
--
-- JSONB columns hold the variable-shape stuff (tier ladders, credit rules)
-- so we don't have to migrate the table every time we discover a new EFL
-- format quirk. Keep flat scalars as columns for fast filtering.
------------------------------------------------------------------------
create table public.plan_details (
  plan_id            bigint      primary key references public.plans(id) on delete cascade,
  parsed_at          timestamptz not null default now(),
  parser_version     text        not null,            -- e.g. "tier-a-v1"
  parser_tier        text        not null check (parser_tier in ('text','vision')),

  base_charge        numeric(7,2),                    -- monthly base/service fee
  etf_amount         numeric(8,2),                    -- early termination fee
  minimum_usage_fee  numeric(7,2),                    -- some plans charge below threshold

  energy_charge      jsonb,                           -- tier ladder, e.g. [{kwh: 1000, rate: 0.089}, ...]
  bill_credits       jsonb,                           -- credit rules
  tdu_charges        jsonb,                           -- pass-throughs

  raw_text           text,                            -- extracted PDF text — for debugging
  parse_errors       text[]      not null default '{}'
);

------------------------------------------------------------------------
-- 6. Ingest runs — audit log for every nightly run, so you can answer
--    "why did the plan count drop yesterday" without digging through logs.
------------------------------------------------------------------------
create table public.ingest_runs (
  id                  bigint generated always as identity primary key,
  source              text        not null check (source in ('ptc_api','ptc_csv','manual')),
  started_at          timestamptz not null default now(),
  finished_at         timestamptz,
  status              text        not null default 'running' check (status in ('running','ok','error')),
  plans_seen          int         not null default 0,
  plans_inserted      int         not null default 0,
  plans_updated       int         not null default 0,
  plans_deactivated   int         not null default 0,
  efls_parsed         int         not null default 0,
  efls_failed         int         not null default 0,
  error_message       text
);
create index idx_ingest_runs_started on public.ingest_runs (started_at desc);

------------------------------------------------------------------------
-- 7. RLS — deny-by-default on every table. Service-role bypasses; we'll
--          add user-facing read policies in a later migration once auth
--          + the public plan browser exist.
------------------------------------------------------------------------
alter table public.reps          enable row level security;
alter table public.tdus          enable row level security;
alter table public.service_areas enable row level security;
alter table public.plans         enable row level security;
alter table public.plan_details  enable row level security;
alter table public.ingest_runs   enable row level security;

------------------------------------------------------------------------
-- 8. updated_at triggers — keep updated_at fresh on UPDATE.
------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_reps_updated_at
  before update on public.reps
  for each row execute function public.set_updated_at();

create trigger trg_plans_updated_at
  before update on public.plans
  for each row execute function public.set_updated_at();

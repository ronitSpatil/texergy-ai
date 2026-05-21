-- REP customer-satisfaction signal.
--
-- Source: TX PUC Retail Electric Provider Customer Complaint Scorecard, a
-- rolling 6-month snapshot of complaints per 1,000 customers per REP.
-- Published quarterly at puc.texas.gov; we re-seed manually until the
-- scraper lands.
--
-- complaint_rate_per_1000 is intentionally numeric and nullable: null means
-- "no signal" (new REP, not on the scorecard, or scraper hasn't run yet) —
-- the ranker falls back to neutral 0.5 for those, rather than penalizing.

alter table public.reps
  add column if not exists complaint_rate_per_1000 numeric(8, 4),
  add column if not exists complaints_period       text,
  add column if not exists complaints_source_url   text;

comment on column public.reps.complaint_rate_per_1000 is
  '6-month rolling complaint rate per 1,000 customers, sourced from the PUC scorecard.';
comment on column public.reps.complaints_period is
  'Period covered by complaint_rate_per_1000, e.g. "Sep 2025 - Feb 2026".';
comment on column public.reps.complaints_source_url is
  'URL of the PUC scorecard the value was sourced from.';

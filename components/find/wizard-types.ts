export type Mode = "smart" | "basic";

export type RateTypePref = "any" | "Fixed" | "Variable" | "Indexed";
export type RenewablePref = "any" | "atleast50" | "atleast90" | "only100";
export type TermPref = "any" | "monthToMonth" | "short" | "medium" | "long";
export type TimeOfUsePref = "any" | "only" | "none";
export type BaseChargePref = "any" | "zero" | "atmost5" | "atmost10";
export type EtfPref = "any" | "none" | "atmost100" | "atmost200";

export type SortBy = "score" | "rate" | "term" | "bill" | "etf";

export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "score", label: "Match (best fit)" },
  { value: "rate", label: "Rate (low–high)" },
  { value: "term", label: "Term length (low–high)" },
  { value: "bill", label: "Estimated bill (low–high)" },
  { value: "etf", label: "Termination fee (low–high)" },
];

/** Weight values are 0–100 in the UI for easy slider handling; we normalize
 *  inside the recommend call so they sum to 1 internally. */
export type WeightsUI = {
  cost: number;
  renewable: number;
  contractFlexibility: number;
  rateStability: number;
  ratings: number;
};

export type WizardState = {
  zip: string;
  mode: Mode | null;
  monthlyUsageKwh: number;
  rateTypePref: RateTypePref;
  renewablePref: RenewablePref;
  termPref: TermPref;
  timeOfUsePref: TimeOfUsePref;
  baseChargePref: BaseChargePref;
  etfPref: EtfPref;
  providerIds: number[];
  sortBy: SortBy;
  weights: WeightsUI;
  stepIndex: number;
};

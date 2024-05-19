enum SupportOpposeIndicator {
  Support = "S",
  Oppose = "O",
}

export interface Expenditure {
  expenditure_amount: number;
  candidate_office_state: string;
  expenditure_date?: string;
  expenditure_description?: string;
  candidate_first_name?: string;
  candidate_last_name?: string;
  candidate_middle_name?: string;
  candidate_suffix?: string;
  candidate_name: string;
  candidate_office?: string;
  candidate_office_district?: string;
  candidate_party?: string;
  category_code?: string;
  category_code_full?: string;
  payee_name?: string;
  support_oppose_indicator: SupportOpposeIndicator;
}

interface CommitteeExpenditures {
  expenditures: Expenditure[];
  total: number;
}

export interface Expenditures {
  by_committee: Record<string, CommitteeExpenditures>;
  total: number;
}

export interface StateExpenditures {
  state: string;
  expenditures?: Expenditures;
  centroid: [number, number];
}

export interface Contribution {
  contributor_first_name?: string;
  contributor_middle_name?: string;
  contributor_last_name?: string;
  contributor_suffix?: string;
  contributor_name?: string;
  contributor_occupation?: string;
  contributor_employer?: string;
  contribution_receipt_amount: number;
  contribution_receipt_date?: string;
  entity_type?: string;
  redacted: boolean;
}

export interface ContributionsGroup {
  company?: string;
  contributions: Contribution[];
  total: number;
}

export interface Contributions {
  contributions_count: number;
  groups: ContributionsGroup[];
}

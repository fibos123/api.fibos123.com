export interface IProducers {
  rows: Row[];
  more: boolean;
}

export interface Row {
  owner: string;
  total_votes: string;
  producer_key: string;
  is_active: number;
  url: string;
  unpaid_blocks: number;
  last_claim_time: string;
  location: number;
}

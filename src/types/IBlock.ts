export interface IBlock {
  timestamp: string;
  producer: string;
  confirmed: number;
  previous: string;
  transaction_mroot: string;
  action_mroot: string;
  schedule_version: number;
  new_producers: any;
  header_extensions: any[];
  producer_signature: string;
  transactions: any[];
  block_extensions: any[];
  id: string;
  block_num: number;
  ref_block_prefix: number;
}

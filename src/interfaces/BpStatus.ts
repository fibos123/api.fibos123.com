export interface BpStatus {
  rows: any[];
  rows2: Rows2[];
  head_block_num: number;
  head_block_time: string | Date;
  head_block_producer: string;
  bp_status_refresh_time: string | Date;
  start_time: string | Date;
}

export interface Rows2 {
  bpname: string;
  number: number;
  date: any;
}

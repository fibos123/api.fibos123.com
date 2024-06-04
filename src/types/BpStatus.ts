export class BpStatus {
  rows2: Rows2[] = [];
  head_block_num: number;
  head_block_time: string | Date;
  head_block_producer: string;
}

export class Rows2 {
  bpname: string;
  number: number | null;
  date: any | null;
}

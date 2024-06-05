export class BpStatus {
  rows2: Rows2[] = [];
  head_block_num: number | null | undefined;
  head_block_time: string | null | undefined;
  head_block_producer: string | null | undefined;
}

export class Rows2 {
  bpname: string;
  number: number | null;
  date: any | null;
}

import { Rows2, BpStatus } from "../types/BpStatus";
import type { IBlock } from "../types/IBlock";
import type { IInfo } from "../types/IInfo";
import type { IProducers } from "../types/IProducers";
import fs from "fs";

export default class BpStatusService {
  private _list: string[] = [];
  private _bpInfo = new Map<string, Rows2>();
  private _head = {
    head_block_num: 0,
    head_block_time: '',
    head_block_producer: '',
    bp_status_refresh_time: new Date(),
    start_time: new Date(),
  };
  private _rpc_endpoint = process.env.FIBOS_RPC_ENDPOINT || "https://rpc-mainnet.fibos123.com";
  private _config = {
    rpc_endpoint: this._rpc_endpoint,
    rpc_get_table_rows: this._rpc_endpoint + '/v1/chain/get_table_rows',
    rpc_get_info: this._rpc_endpoint + '/v1/chain/get_info',
    rpc_get_block: this._rpc_endpoint + '/v1/chain/get_block',
  };
  private _save_filepath = "./data/data.json"

  constructor() {
    setTimeout(this._init.bind(this), 1 * 1000) // 1 s
  }

  private async _init() {
    await this.readTemp()
    await this._getBPs();
    await this._getHead();
    this._getLast();
    setInterval(this._getHead.bind(this), 1000); // 1s
    setInterval(this._getBPs.bind(this), 1000 * 60 * 10); // 10min
    setInterval(this.saveTemp.bind(this), 1000 * 60 * 1); // 1 min
  }

  public getBpStatus(): BpStatus {
    const data = new BpStatus();
    data.head_block_num = this._head.head_block_num;
    data.head_block_time = this._head.head_block_time;
    data.head_block_producer = this._head.head_block_producer;

    data.rows2 = this._list.map(
      (bpName) =>
        this._bpInfo.get(bpName) || {
          bpname: bpName,
          number: 0,
          date: '',
        },
    );
    return data;
  }

  private async _getHead() {
    const response = await fetch(this._config.rpc_get_info);
    const data = await response.json() as IInfo;
    this._head = {
      head_block_num: data.head_block_num,
      head_block_time: data.head_block_time,
      head_block_producer: data.head_block_producer,
      bp_status_refresh_time: new Date(),
      start_time: this._head.start_time,
    };
    this._bpInfo.set(data.head_block_producer, {
      bpname: data.head_block_producer,
      number: data.head_block_num,
      date: data.head_block_time,
    });
  }

  private async _getBPs() {
    const response = await fetch(this._config.rpc_get_table_rows, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scope: 'eosio',
        code: 'eosio',
        table: 'producers',
        json: true,
        limit: 21,
        key_type: 'float64',
        index_position: 2,
      }),
    });
    const data = await response.json() as IProducers;

    if (!data.rows || !data.rows.length) {
      return false;
    }
    const bps = data.rows.map((x) => x.owner);
    const sort = bps.sort();

    this._list = sort;
  }

  private async _getBlock(block_num_or_id: string | number) {
    try {
      const response = await fetch(this._config.rpc_get_block, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block_num_or_id: block_num_or_id,
        }),
      });
      const data = await response.json() as IBlock;
      this._bpInfo.set(data.producer, {
        bpname: data.producer,
        number: data.block_num,
        date: data.timestamp,
      });
    } catch (error) {
      console.error(error);
    }
  }

  private async _getLast() {
    const head_block_num = this._head.head_block_num;
    for (let i = 1; i <= 20; i++) {
      this._getBlock(head_block_num - i * 12);
    }
  }

  private async readTemp() {
    if (fs.existsSync(this._save_filepath)) {
      const bp_temp_string = fs.readFileSync(this._save_filepath)
      if (bp_temp_string) {
        const bp_temp_array = JSON.parse(bp_temp_string.toString()) as Rows2[]
        bp_temp_array.forEach(bpinfo => {
          this._bpInfo.set(bpinfo.bpname, {
            bpname: bpinfo.bpname,
            number: bpinfo.number,
            date: bpinfo.date,
          });
        });
      }
    }
  }

  private async saveTemp() {
    const content: any[] = []
    this._bpInfo.forEach((value, key, map) => {
      content.push(value)
    })
    if (!content.length) {
      return
    }

    fs.writeFileSync(this._save_filepath, JSON.stringify(content, null, 2))
  }
}
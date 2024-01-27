import { Injectable } from '@nestjs/common';
import { IBlock } from '../interfaces/IBlock';
import { IInfo } from '../interfaces/IInfo';
import { IProducers } from '../interfaces/IProducers';
import { BpStatus, Rows2 } from '../interfaces/BpStatus';

@Injectable()
export class BpStatusService {
  private _list: string[] = [];
  private _bpInfo = new Map<string, Rows2>();
  private _head = {
    head_block_num: 0,
    head_block_time: '',
    head_block_producer: '',
    bp_status_refresh_time: new Date(),
    start_time: new Date(),
  };
  private _rpc_endpoint = process.env.FIBOS_RPC_ENDPOINT;
  private _config = {
    rpc_endpoint: this._rpc_endpoint,
    rpc_get_table_rows: this._rpc_endpoint + '/v1/chain/get_table_rows',
    rpc_get_info: this._rpc_endpoint + '/v1/chain/get_info',
    rpc_get_block: this._rpc_endpoint + '/v1/chain/get_block',
  };

  constructor() {
    setTimeout(this._init.bind(this), 1 * 1000) // 1min
  }

  private async _init() {
    await this._getBPs();
    await this._getHead();
    this._getLast();
    setInterval(this._getHead.bind(this), 1000); // 1s
    setInterval(this._getBPs.bind(this), 1000 * 60 * 10); // 10min
  }

  public getBpStatus(): BpStatus {
    const data = new BpStatus();
    data.head_block_num = this._head.head_block_num;
    data.head_block_time = this._head.head_block_time;
    data.head_block_producer = this._head.head_block_producer;
    this._list.forEach((bpName) => {
      data.rows[bpName] =
        this._head.head_block_num - this._bpInfo.get(bpName)?.number > 504
          ? 'offline'
          : 'online';
    });

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
    const data: IInfo = await response.json();
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
    const data: IProducers = await response.json();
    if (!data.rows || !data.rows.length) {
      return false;
    }
    const bps = data.rows.map((x) => x.owner);
    const sort = bps.sort();
    this._list = sort;
  }

  private async _getBlock(block_num_or_id: string | number) {
    const response = await fetch(this._config.rpc_get_block, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        block_num_or_id: block_num_or_id,
      }),
    });
    const data: IBlock = await response.json();
    this._bpInfo.set(data.producer, {
      bpname: data.producer,
      number: data.block_num,
      date: data.timestamp,
    });
    return data;
  }

  private async _getLast() {
    const head_block_num = this._head.head_block_num;
    for (let i = 1; i <= 20; i++) {
      this._getBlock(head_block_num - i * 12);
    }
  }
}

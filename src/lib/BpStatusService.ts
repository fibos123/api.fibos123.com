import { eq, lte, max } from "drizzle-orm";
import { bps, head } from "../schema";
import { BpStatus } from "../types/BpStatus";
import type { IBlock } from "../types/IBlock";
import type { IInfo } from "../types/IInfo";
import type { IProducers } from "../types/IProducers";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { Context } from "hono";

type Bindings = {
  DB: D1Database;
};

export default class BpStatusService {
  private _rpc_endpoint = "https://rpc-mainnet.fibos123.com";
  private _config = {
    rpc_endpoint: this._rpc_endpoint,
    rpc_get_table_rows: this._rpc_endpoint + '/v1/chain/get_table_rows',
    rpc_get_info: this._rpc_endpoint + '/v1/chain/get_info',
    rpc_get_block: this._rpc_endpoint + '/v1/chain/get_block',
  };
  private db: DrizzleD1Database<Record<string, never>>;
  constructor(c: Context<{
    Bindings: Bindings;
  }>) {
    this.db = drizzle(c.env.DB);
  }

  public async getBpStatus(): Promise<BpStatus> {
    let headData: any = null
    try {
      headData = await this.getHead()
    } catch {
    }

    if (headData === null) {
      headData = await this.db.select().from(head).get();
    }

    const bp21 = await this.db
      .select({ bpname: bps.bpname, number: bps.number, date: bps.date })
      .from(bps)
      .where(lte(bps.ranking, 21))
      .orderBy(bps.bpname)
      .all();
    const data: BpStatus = {
      head_block_num: headData.head_block_num,
      head_block_time: headData.head_block_time,
      head_block_producer: headData.head_block_producer,
      rows2: bp21,
    }
    return data;
  }

  public async getBPs() {
    const response = await fetch(this._config.rpc_get_table_rows, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scope: 'eosio',
        code: 'eosio',
        table: 'producers',
        json: true,
        limit: 100,
        key_type: 'float64',
        index_position: 2,
      }),
    });
    try {
      const data = await response.json() as IProducers;
      if (!data.rows || !data.rows.length) {
        return false;
      }
      data.rows.forEach(async (bp, index) => {
        const ranking = index + 1
        await this.db.insert(bps)
          .values({ ranking: ranking, bpname: bp.owner, number: 0 })
          .onConflictDoUpdate({
            target: bps.bpname,
            set: {
              ranking: ranking
            }
          });
      })
    } catch (error) {
      console.error("getBPs response: ", error);
    }
    return true;
  }

  private async getBlock(block_num_or_id: string | number) {
    try {
      console.log("getBlock", block_num_or_id);
      const response = await fetch(this._config.rpc_get_block, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block_num_or_id: block_num_or_id,
        }),
      });
      const data = await response.json() as IBlock;
      await this.db
        .update(bps)
        .set({ number: data.block_num, date: data.timestamp })
        .where(eq(bps.bpname, data.producer));
    } catch (error) {
      console.error("getBlock response: ", error);
    }
  }

  private async getLast(head_block_num: number) {
    const bpsMax = await this.db.select({ value: max(bps.number) }).from(bps).get();
    if (!bpsMax || !bpsMax?.value) {
      return
    }
    const oldMax = bpsMax?.value
    if (oldMax < head_block_num) {
      const promises = [];
      for (let i = Math.max(head_block_num - 12 * 20, oldMax); i < head_block_num; i += 12) {
        promises.push(this.getBlock(i));
      }
      await Promise.all(promises);
    }
  }

  private async getHead() {
    const response = await fetch(this._config.rpc_get_info);
    let headData = null;
    try {
      const data = await response.json() as IInfo;
      headData = {
        id: 1
        , head_block_num: data.head_block_num
        , head_block_time: data.head_block_time
        , head_block_producer: data.head_block_producer
      }
      await this.db.insert(head)
        .values(headData)
        .onConflictDoUpdate({
          target: head.id,
          set: {
            head_block_num: data.head_block_num
            , head_block_time: data.head_block_time
            , head_block_producer: data.head_block_producer
          }
        });

      await this.getLast(data.head_block_num)
      await this.db
        .update(bps)
        .set({ number: data.head_block_num, date: data.head_block_time })
        .where(eq(bps.bpname, data.head_block_producer));
    } catch (error) {
      console.error("getHead response: ", error);
    }
    return headData
  }
}
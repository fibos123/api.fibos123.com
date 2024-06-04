import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const head = sqliteTable("head", {
  id: integer("id", { mode: "number" }).primaryKey(),
  head_block_num: integer("head_block_num", { mode: "number" }),
  head_block_time: text("head_block_time"),
  head_block_producer: text("head_block_producer"),
});

export const bps = sqliteTable("bps", {
  bpname: text("bpname").primaryKey(),
  ranking: integer("ranking", { mode: "number" }),
  number: integer("number", { mode: "number" }),
  date: text("date"),
});

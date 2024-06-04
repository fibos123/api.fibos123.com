import type { Config } from "drizzle-kit";

// https://qiita.com/kmkkiii/items/2b22fa53a90bf98158c0
// npx drizzle-kit generate
// npx wrangler d1 migrations apply api-fibos123-com --local

export default {
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: 'sqlite',
  driver: "expo"
} satisfies Config;

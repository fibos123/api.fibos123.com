import { Hono } from "hono";
import { cors } from "hono/cors";
import { html } from "hono/html";
import last_snapshot from "./last_snapshot";
import bp_status from "./bp_status";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors())

app.get('/', (c) => {
  return c.html(
    html`<!DOCTYPE html>
      <html>
        <a href="/bp_status">/bp_status</a><br>
        <a href="/last_snapshot">/last_snapshot</a><br>
        <center><img src="https://pbs.twimg.com/media/DbxJHDDV0AI8bOt?format=jpg&name=4096x4096" width="400" /><br/>Lillie (Pokémon)</center>
      </html>`
  )
})

app.route('/last_snapshot', last_snapshot)

app.route('/bp_status', bp_status)

export default app;


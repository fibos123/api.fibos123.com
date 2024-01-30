import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('https://snapshots.fibos123.com/latest.bin'))

export default app

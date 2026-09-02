import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('https://backup-fibos-v5.akirafy.workers.dev/latest.bin'))

export default app

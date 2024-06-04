import { Hono } from 'hono'
import BpStatusService from './lib/BpStatusService';

type Bindings = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
    const bpStatusService = new BpStatusService(c);
    return c.json(await bpStatusService.getBpStatus());
})

app.get('/updateBps', async (c) => {
    const bpStatusService = new BpStatusService(c);
    return c.json(await bpStatusService.getBPs());
})

export default app

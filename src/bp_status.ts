import { Hono } from 'hono'
import BpStatusService from './lib/BpStatusService';

type Bindings = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
    const bpStatusService = new BpStatusService(c);
    // Hidden probe: /bp_status?nohead=1 skips getHead() (see BpStatusService).
    const skipHead = c.req.query('nohead') !== undefined && c.req.query('nohead') !== '0';
    return c.json(await bpStatusService.getBpStatus(skipHead));
})

app.get('/updateBps', async (c) => {
    const bpStatusService = new BpStatusService(c);
    return c.json(await bpStatusService.getBPs());
})

export default app

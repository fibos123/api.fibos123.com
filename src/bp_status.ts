import { Hono } from 'hono'
import BpStatusService from './lib/BpStatusService';

const app = new Hono()

const bpStatusService = new BpStatusService();

app.get('/', (c) => c.json(bpStatusService.getBpStatus()))

export default app

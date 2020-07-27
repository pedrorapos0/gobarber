import { Router } from 'express';
import appointmentsRouter from './routes/appointments.routes.ts';

const routes = Router();
routes.use('/appointments', appointmentsRouter);

export default routes;

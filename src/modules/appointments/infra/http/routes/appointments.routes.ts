import { Router } from 'express';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

/* appointmentsRouter.get('/', ensureAuthenticated, async (request, response) => {
  const appointments = await appointmentRepository.();
  return response.json(appointments);
}); */

appointmentsRouter.post(
  '/',
  ensureAuthenticated,
  appointmentsController.create,
);

export default appointmentsRouter;

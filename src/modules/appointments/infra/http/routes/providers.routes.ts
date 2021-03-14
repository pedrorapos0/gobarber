import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProviderController from '@modules/appointments/infra/http/controllers/ProviderController';
import ProviderMonthAvailability from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailability from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';

const providerRoutes = Router();
const providerController = new ProviderController();
const providerMonthAvailability = new ProviderMonthAvailability();
const providerDayAvailability = new ProviderDayAvailability();

providerRoutes.use(ensureAuthenticated);
providerRoutes.get('/', providerController.show);
providerRoutes.get(
  '/:provider_id/month-availability',
  providerMonthAvailability.show,
);
providerRoutes.get(
  '/:provider_id/day-availability',
  providerDayAvailability.show,
);

export default providerRoutes;

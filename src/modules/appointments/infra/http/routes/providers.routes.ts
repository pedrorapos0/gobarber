import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

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
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthAvailability.show,
);
providerRoutes.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerDayAvailability.show,
);

export default providerRoutes;

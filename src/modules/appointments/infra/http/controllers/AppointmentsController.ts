import { container } from 'tsyringe';
import { Request, Response } from 'express';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

class AppointmentsControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;
    const createAppointmentService = container.resolve(
      CreateAppointmentService,
    );
    const appointment = await createAppointmentService.execute({
      provider_id,
      date,
      user_id,
    });
    return response.json(appointment);
  }
}

export default AppointmentsControllers;

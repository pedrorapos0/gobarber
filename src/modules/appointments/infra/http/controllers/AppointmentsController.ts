import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import User from '@modules/users/infra/typeorm/entites/User';

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

    appointment.user = classToClass(User);
    return response.json(appointment);
  }
}

export default AppointmentsControllers;

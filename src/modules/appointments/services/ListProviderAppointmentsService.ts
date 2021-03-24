import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entites/Appointment';
import AppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  day: number;
  month: number;
  year: number;
  provider_id: string;
}

@injectable()
class ListProviderAppointmentsService {
  private appointmentRepository: AppointmentRepository;

  constructor(
    @inject('AppointmentRepository')
    appointmentRepository: AppointmentRepository,
  ) {
    this.appointmentRepository = appointmentRepository;
  }

  public async execute({
    day,
    month,
    year,
    provider_id,
  }: IRequest): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.findAllInDayFromProvider(
      { day, month, year, provider_id },
    );
    return appointments;
  }
}

export default ListProviderAppointmentsService;

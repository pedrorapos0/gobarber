import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entites/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
  provider_id: string;

  date: Date;
}

@injectable()
class CreateAppointmentService {
  private appointmentRepository: IAppointmentsRepository;

  constructor(
    @inject('AppointmentRepository')
    appointmentRepository: IAppointmentsRepository,
  ) {
    this.appointmentRepository = appointmentRepository;
  }

  public async execute({
    provider_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    const dateParsed = startOfHour(date);
    const findAppointmentInSameDate = await this.appointmentRepository.findByDate(
      dateParsed,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }
    const appointment = await this.appointmentRepository.create({
      provider_id,
      date: dateParsed,
    });

    return appointment;
  }
}

export default CreateAppointmentService;

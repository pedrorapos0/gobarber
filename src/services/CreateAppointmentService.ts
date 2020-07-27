import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentRepository';

interface RequestDTO {
  provider: string;

  date: Date;
}

class CreateAppointmentService {
  private appointmentRepository: AppointmentRepository;

  constructor(appointmentRepository: AppointmentRepository) {
    this.appointmentRepository = appointmentRepository;
  }

  public execute({ provider, date }: RequestDTO): Appointment {
    const dateParsed = startOfHour(date);
    const findAppointmentInSameDate = this.appointmentRepository.findByDate(
      dateParsed,
    );
    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    }
    const appointment = this.appointmentRepository.create({
      provider,
      date: dateParsed,
    });
    return appointment;
  }
}

export default CreateAppointmentService;

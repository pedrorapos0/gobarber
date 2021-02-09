import { promises } from 'fs';

import Appointment from '@modules/appointments/infra/typeorm/entites/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

interface IAppointmentsRepository {
  findByDate(date: Date): Promise<Appointment | undefined>;
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
}

export default IAppointmentsRepository;

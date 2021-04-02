import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entites/Appointment';
import AppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
  day: number;
  month: number;
  year: number;
  provider_id: string;
}

@injectable()
class ListProviderAppointmentsService {
  private appointmentRepository: AppointmentRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('AppointmentRepository')
    appointmentRepository: AppointmentRepository,
    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.appointmentRepository = appointmentRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute({
    day,
    month,
    year,
    provider_id,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;
    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );
    if (!appointments) {
      appointments = await this.appointmentRepository.findAllInDayFromProvider({
        day,
        month,
        year,
        provider_id,
      });
      await this.cacheProvider.save(cacheKey, classToClass(appointments));
    }
    return appointments;
  }
}

export default ListProviderAppointmentsService;

import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import AppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

type IReposnse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  private appointmentsRepository: AppointmentsRepository;

  constructor(
    @inject('AppointmentRepository')
    appointmentsRepository: AppointmentsRepository,
  ) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<IReposnse> {
    const startHour = 8;

    const eachHoursArray = Array.from(
      { length: 10 },
      (_, index) => index + startHour,
    );

    const appontmentsInDay = await this.appointmentsRepository.findAllInDayFromProvider(
      { provider_id, day, month, year },
    );

    const currentDate = new Date(Date.now());

    const availabilily = eachHoursArray.map(hour => {
      const hasappointmentInHour = appontmentsInDay.find(
        appointment => getHours(appointment.date) === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasappointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availabilily;
  }
}

export default ListProviderDayAvailabilityService;

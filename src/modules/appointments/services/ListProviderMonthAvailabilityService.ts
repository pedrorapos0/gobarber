import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';

import AppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  private appointmentRepository: AppointmentRepository;

  constructor(
    @inject('AppointmentRepository')
    appointmentRepository: AppointmentRepository,
  ) {
    this.appointmentRepository = appointmentRepository;
  }

  public async execute({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<IResponse> {
    const appointmentsInMonth = await this.appointmentRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDaysArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availabilily = eachDaysArray.map(day => {
      const appointmentDay = appointmentsInMonth.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available: appointmentDay.length < 10,
      };
    });

    return availabilily;
  }
}

export default ListProviderMonthAvailabilityService;

import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entites/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  private appointmentRepository: IAppointmentsRepository;

  private notificationRepository: INotificationRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('AppointmentRepository')
    appointmentRepository: IAppointmentsRepository,
    @inject('NotificationRepository')
    notificationRepository: INotificationRepository,
    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.appointmentRepository = appointmentRepository;
    this.notificationRepository = notificationRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    const dateParsed = startOfHour(date);

    if (getHours(dateParsed) < 8 || getHours(dateParsed) > 17) {
      throw new AppError('you cant  create appointment between 7am and 5pm');
    }

    if (user_id === provider_id) {
      throw new AppError("you can't create an appointment with youself");
    }

    if (isBefore(dateParsed, Date.now())) {
      throw new AppError("you can't create an appointment on a past date");
    }

    const findAppointmentInSameDate = await this.appointmentRepository.findByDate(
      dateParsed,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }
    const appointment = await this.appointmentRepository.create({
      provider_id,
      user_id,
      date: dateParsed,
    });

    const dateFormatted = format(dateParsed, "dd/MM/yyyy 'ás' HH:mm'h'");

    await this.notificationRepository.create({
      content: `Novo agendamento para dia ${dateFormatted}`,
      recipient_id: provider_id,
    });
    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(dateParsed, 'yyyy-M-d')}`,
    );
    return appointment;
  }
}

export default CreateAppointmentService;

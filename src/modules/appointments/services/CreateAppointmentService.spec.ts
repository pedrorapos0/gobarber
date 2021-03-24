import FakeAppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FakeNotificationRepository from '@modules/notifications/infra/typeorm/repositories/fakes/FakeNotificationRepository';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationRepository: FakeNotificationRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 2, 14, 16).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2021, 2, 15, 8),
      user_id: 'user_id',
      provider_id: 'provider_id',
    });
    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create a new appointment on the same date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 2, 14, 16).getTime();
    });

    const appoinmentDate = new Date(2021, 2, 15, 16);
    await createAppointmentService.execute({
      date: appoinmentDate,
      user_id: 'user_id',
      provider_id: 'provider_id',
    });
    await expect(
      createAppointmentService.execute({
        date: appoinmentDate,
        provider_id: 'provider_id',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 2, 13, 16).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(2021, 2, 12, 8),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 2, 12, 16).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider_id',
        user_id: 'provider_id',
        date: new Date(2021, 2, 16, 8),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm ', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 2, 12, 16).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(2021, 2, 16, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

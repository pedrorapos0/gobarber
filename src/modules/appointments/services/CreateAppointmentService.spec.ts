import FakeAppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

describe('CreateAppointments', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '123654789',
    });
    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appoinmentDate = new Date(2021, 1, 11, 20);
    await createAppointmentService.execute({
      date: appoinmentDate,
      provider_id: '123654789',
    });
    expect(
      createAppointmentService.execute({
        date: appoinmentDate,
        provider_id: '123654789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

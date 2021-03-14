import 'reflect-metadata';

import FakeAppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 2, 12, 8, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 2, 12, 9, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 2, 12, 10, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 2, 12, 11, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 2, 12, 12, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 2, 12, 13, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 2, 12, 14, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 2, 12, 15, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 2, 12, 16, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 2, 12, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 2, 13, 10, 0, 0),
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'provider_id',
      year: 2021,
      month: 3,
    });
    expect(availability).toEqual(
      expect.arrayContaining([
        {
          day: 12,
          available: false,
        },
        {
          day: 13,
          available: true,
        },
      ]),
    );
  });
});

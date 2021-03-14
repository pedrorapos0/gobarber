import FakeAppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });
  it('should be able to list the day availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      date: new Date(2021, 2, 15, 8),
      user_id: 'user_id',
      provider_id: 'provider_id',
    });
    await fakeAppointmentsRepository.create({
      date: new Date(2021, 2, 15, 13),
      user_id: 'user_id',
      provider_id: 'provider_id',
    });
    await fakeAppointmentsRepository.create({
      date: new Date(2021, 2, 15, 15),
      user_id: 'user_id',
      provider_id: 'provider_id',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 2, 15, 11).getDate();
    });

    const hoursAvailable = await listProviderDayAvailabilityService.execute({
      provider_id: 'provider_id',
      day: 15,
      month: 3,
      year: 2021,
    });
    expect(hoursAvailable).toEqual(
      expect.arrayContaining([
        {
          hour: 13,
          available: false,
        },
        {
          hour: 15,
          available: false,
        },
        {
          hour: 16,
          available: true,
        },
        {
          hour: 17,
          available: true,
        },
      ]),
    );
  });
});

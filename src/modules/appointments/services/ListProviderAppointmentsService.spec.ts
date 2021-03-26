import FakeAppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list appointments on as specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      date: new Date(2021, 2, 22, 8),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      date: new Date(2021, 2, 22, 9),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 2, 22, 7).getTime();
    });

    const appointments = await listProviderAppointmentsService.execute({
      day: 22,
      month: 3,
      year: 2021,
      provider_id: 'provider_id',
    });
    expect(appointments).toEqual([appointment1, appointment2]);
  });
});

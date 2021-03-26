import 'reflect-metadata';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeUserRepository from '@modules/users/infra/typeorm/entites/repositories/fakes/FakeUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let listProvidersService: ListProvidersService;
let fakeUserRepository: FakeUserRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProvidersService = new ListProvidersService(
      fakeUserRepository,
      fakeCacheProvider,
    );
  });

  it('should be able list the providers', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'user1',
      email: 'user1@mail.com',
      password: '123456',
    });
    const user2 = await fakeUserRepository.create({
      name: 'user2',
      email: 'user2@mail.com',
      password: '123456',
    });
    const loggedUser = await fakeUserRepository.create({
      name: 'Logged User',
      email: 'loggeduser@mail.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    await expect(providers).toEqual([user1, user2]);
  });
});

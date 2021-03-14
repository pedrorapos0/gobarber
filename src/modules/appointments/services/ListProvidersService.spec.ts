import 'reflect-metadata';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeUserRepository from '@modules/users/infra/typeorm/entites/repositories/fakes/FakeUserRepository';

let listProvidersService: ListProvidersService;
let fakeUserRepository: FakeUserRepository;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    listProvidersService = new ListProvidersService(fakeUserRepository);
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

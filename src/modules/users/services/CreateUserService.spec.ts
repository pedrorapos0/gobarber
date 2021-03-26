import FakeUserRepository from '@modules/users/infra/typeorm/entites/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUserServices', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      email: 'pedroraposoneto@gmail.com',
      name: 'Pedro Raposo',
      password: '123456',
    });
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    await createUserService.execute({
      email: 'pedroraposoneto@gmail.com',
      name: 'Pedro Raposo',
      password: '123456',
    });
    await expect(
      createUserService.execute({
        email: 'pedroraposoneto@gmail.com',
        name: 'Pedro Raposo',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import 'reflect-metadata';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import FakeUserRepository from '@modules/users/infra/typeorm/entites/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('Should be able update the profile ', async () => {
    const user = await fakeUserRepository.create({
      email: 'pedroraposoneto@gmail.com',
      name: 'Pedro Raposo',
      password: '123456',
    });

    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      email: 'pedroneto@gmail.com',
      name: 'Pedro da Costa Raposo Neto',
    });

    expect(updateUser.name).toBe('Pedro da Costa Raposo Neto');
    expect(updateUser.email).toBe('pedroneto@gmail.com');
  });

  it('Should not be able update the profile with user non-existing ', async () => {
    await fakeUserRepository.create({
      name: 'Pedro Raposo',
      email: 'pedroraposoneto@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: 'non-exiting',
        name: 'Test',
        email: 'teste@mail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able change the email another user email', async () => {
    await fakeUserRepository.create({
      email: 'pedroraposoneto@gmail.com',
      name: 'Pedro Raposo',
      password: '123456',
    });

    const userUpdate = await fakeUserRepository.create({
      email: 'teste@mail.com',
      name: 'teste',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: userUpdate.id,
        email: 'pedroraposoneto@gmail.com',
        name: 'teste',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able update the password ', async () => {
    const user = await fakeUserRepository.create({
      email: 'pedroraposoneto@gmail.com',
      name: 'Pedro Raposo',
      password: '123456',
    });

    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      email: 'pedroneto@gmail.com',
      name: 'Pedro Raposo',
      old_password: '123456',
      password: '1234567',
    });

    expect(updateUser.password).toBe('1234567');
  });

  it('Should not be able update the password without old password', async () => {
    const user = await fakeUserRepository.create({
      email: 'pedroraposoneto@gmail.com',
      name: 'Pedro Raposo',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        email: 'pedroneto@gmail.com',
        name: 'Pedro Raposo',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able update the password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      email: 'pedroraposoneto@gmail.com',
      name: 'Pedro Raposo',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        email: 'pedroneto@gmail.com',
        name: 'Pedro Raposo',
        old_password: 'wrong password',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

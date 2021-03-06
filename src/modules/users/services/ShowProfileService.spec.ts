import 'reflect-metadata';

import ShowProfileService from '@modules/users/services/ShowProfileService';
import FakeUserRepository from '@modules/users/infra/typeorm/entites/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    showProfileService = new ShowProfileService(fakeUserRepository);
  });

  it('should be able show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Pedro Raposo',
      email: 'pedroraposoneto@gmail.com',
      password: '123456',
    });

    const profileUser = await showProfileService.execute(user.id);

    expect(profileUser.name).toBe(user.name);
    expect(profileUser.email).toBe(user.email);
  });

  it('should not be able show the profile from non-existing user', async () => {
    await fakeUserRepository.create({
      name: 'Pedro Raposo',
      email: 'pedroraposoneto@gmail.com',
      password: '123456',
    });

    await expect(
      showProfileService.execute('non-existing'),
    ).rejects.toBeInstanceOf(AppError);
  });
});

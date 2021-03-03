import FakeUsersRepository from '@modules/users/infra/typeorm/entites/repositories/fakes/FakeUserRepository';
import FakeUserTokensRepository from '@modules/users/infra/typeorm/entites/repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });
  it('should be able reset password', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    const user = await fakeUsersRepository.create({
      name: 'Pedro Raposo',
      email: 'pedroraposoneto@gmail.com',
      password: '123456',
    });
    const userToken = await fakeUserTokensRepository.generate(user.id);
    await resetPasswordService.execute({
      token: userToken.token,
      password: '1234567',
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('1234567');
    expect(updatedUser?.password).toBe('1234567');
  });

  it('should not able reset password with user non-existing', async () => {
    await fakeUsersRepository.create({
      name: 'Pedro Raposo',
      email: 'pedroraposoneto@gmail.com',
      password: '123456',
    });

    const userToken = await fakeUserTokensRepository.generate('non_existing');

    await expect(
      resetPasswordService.execute({
        token: userToken.token,
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not able reset password with user token non-existing', async () => {
    await fakeUsersRepository.create({
      name: 'Pedro Raposo',
      email: 'pedroraposoneto@gmail.com',
      password: '123456',
    });

    await expect(
      resetPasswordService.execute({
        token: 'non-existing',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset passsword if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Pedro Raposo',
      email: 'pedroraposoneto@gmail.com',
      password: '123456',
    });
    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUserRepository from '@modules/users/infra/typeorm/entites/repositories/fakes/FakeUserRepository';
import HashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserTokensRepository from '@modules/users/infra/typeorm/entites/repositories/fakes/FakeUserTokensRepository';
import AppError from '@shared/errors/AppError';

let fakeMailProvider: FakeMailProvider;
let usersRepository: FakeUserRepository;
let hashProvider: HashProvider;
let createUserService: CreateUserService;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;
let userTokensRepository: FakeUserTokensRepository;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeMailProvider = new FakeMailProvider();
    usersRepository = new FakeUserRepository();
    hashProvider = new HashProvider();
    userTokensRepository = new FakeUserTokensRepository();
    createUserService = new CreateUserService(usersRepository, hashProvider);
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeMailProvider,
      usersRepository,
      userTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sentMail = jest.spyOn(fakeMailProvider, 'sendMail');
    const user = await createUserService.execute({
      email: 'pedroraposoneto@gmail.com',
      name: 'Pedro Raposo',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: user.email,
    });
    expect(sentMail).toHaveBeenCalled();
  });

  it('should not able recovery  non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'non-existing email',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(userTokensRepository, 'generate');
    const user = await createUserService.execute({
      name: 'Pedro Raposo',
      email: 'pedroraposoneto@gmail.com',
      password: '123456',
    });
    await sendForgotPasswordEmailService.execute({
      email: user.email,
    });

    expect(generateToken).toBeCalledWith(user.id);
  });
});

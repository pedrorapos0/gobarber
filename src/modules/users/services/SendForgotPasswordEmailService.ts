import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import path from 'path';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  private mailProvider: IMailProvider;

  private userTokensRepository: IUserTokensRepository;

  private userRepository: IUsersRepository;

  constructor(
    @inject('MailProvider') mailProvider: IMailProvider,
    @inject('UserRepository') userRepository: IUsersRepository,
    @inject('UserTokensRepository') userTokensRepository: IUserTokensRepository,
  ) {
    this.mailProvider = mailProvider;
    this.userRepository = userRepository;
    this.userTokensRepository = userTokensRepository;
  }

  public async execute(data: IRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('User does not exists.');
    }
    const { token } = await this.userTokensRepository.generate(user.id);
    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );
    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `https://localhost:3000/password/reset?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;

import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

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
    await this.mailProvider.sendMail(
      data.email,
      `Pedido de recuperação de senha recebido: ${token}`,
    );
  }
}

export default SendForgotPasswordEmailService;

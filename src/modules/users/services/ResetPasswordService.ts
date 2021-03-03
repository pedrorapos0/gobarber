import { inject, injectable } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import UserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  private userTokensRepository: UserTokensRepository;

  private userRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UserRepository') userRepository: IUsersRepository,
    @inject('UserTokensRepository') userTokensRepository: UserTokensRepository,
    @inject('HashProvider') hashProvider: IHashProvider,
  ) {
    this.userRepository = userRepository;

    this.userTokensRepository = userTokensRepository;

    this.hashProvider = hashProvider;
  }

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('User token does not exist.');
    }

    const tokenCreatedAt = userToken.created_at;
    const copareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), copareDate)) {
      throw new AppError('Token expired.');
    }

    const user = await this.userRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User does not exist.');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.save(user);
  }
}

export default ResetPasswordService;

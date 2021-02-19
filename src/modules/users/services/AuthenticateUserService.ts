import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entites/User';
import auth from '@config/auth';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class Authenticateuser {
  private userRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UserRepository') userRepository: IUsersRepository,
    @inject('HashProvider') hashProvider: IHashProvider,
  ) {
    this.userRepository = userRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }
    const { secret, expiresIn } = auth.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default Authenticateuser;

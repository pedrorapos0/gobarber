import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entites/User';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  private userRepository: IUsersRepository;

  private cacheProvider: ICacheProvider;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UserRepository') userRepository: IUsersRepository,
    @inject('HashProvider') hashProvider: IHashProvider,
    @inject('CacheProvider') cacheProvider: ICacheProvider,
  ) {
    this.userRepository = userRepository;
    this.hashProvider = hashProvider;
    this.cacheProvider = cacheProvider;
  }

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExist = await this.userRepository.findByEmail(email);

    if (checkUserExist) {
      throw new AppError('E-mail address already used');
    }
    const hashedPassword = await this.hashProvider.generateHash(password);
    const user = await this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

export default CreateUserService;

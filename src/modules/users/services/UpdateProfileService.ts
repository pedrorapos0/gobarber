import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import User from '@modules/users/infra/typeorm/entites/User';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
  user_id: string;
  email: string;
  name: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  private userRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UserRepository') userRepository: IUsersRepository,
    @inject('HashProvider') hashProvider: IHashProvider,
  ) {
    this.userRepository = userRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({
    user_id,
    email,
    name,
    old_password,
    password,
  }: IRequestDTO): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const userWithUpdatedeEmail = await this.userRepository.findByEmail(email);

    if (userWithUpdatedeEmail && user.id !== userWithUpdatedeEmail.id) {
      throw new AppError('E-mail already user.');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password.',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    await this.userRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;

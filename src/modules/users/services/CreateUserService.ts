import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entites/User';
import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  private userRepository: IUsersRepository;

  constructor(@inject('UserRepository') userRepository: IUsersRepository) {
    this.userRepository = userRepository;
  }

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExist = await this.userRepository.findByEmail(email);

    if (checkUserExist) {
      throw new AppError('E-mail address already used');
    }
    const hashedPassword = await hash(password, 8);
    const user = await this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;

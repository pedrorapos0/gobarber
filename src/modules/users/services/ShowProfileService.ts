import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entites/User';
import AppError from '@shared/errors/AppError';

@injectable()
class ShowProfileService {
  private userRepository: IUsersRepository;

  constructor(@inject('UserRepository') userRepository: IUsersRepository) {
    this.userRepository = userRepository;
  }

  public async execute(user_id: string): Promise<User> {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found.');
    }
    return user;
  }
}

export default ShowProfileService;

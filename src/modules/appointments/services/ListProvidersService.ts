import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entites/User';
import UserRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  private userRepository: UserRepository;

  constructor(@inject('UserRepository') userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async execute({ user_id }: IRequest): Promise<User[]> {
    const providers = this.userRepository.findAllProvider({
      exception_user_id: user_id,
    });
    return providers;
  }
}
export default ListProvidersService;

import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entites/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  private userRepository: IUsersRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('UserRepository') userRepository: IUsersRepository,
    @inject('CacheProvider') cacheProvider: ICacheProvider,
  ) {
    this.userRepository = userRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute({ user_id }: IRequest): Promise<User[]> {
    let providers = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );

    if (!providers) {
      providers = await this.userRepository.findAllProvider({
        exception_user_id: user_id,
      });

      await this.cacheProvider.save(
        `providers-list:${user_id}`,
        classToClass(providers),
      );
    }

    return providers;
  }
}
export default ListProvidersService;

import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entites/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  private userRepository: IUsersRepository;

  private storageProvider: IStorageProvider;

  constructor(
    @inject('UserRepository') userRepository: IUsersRepository,
    @inject('StorageProvider') storageProvider: IStorageProvider,
  ) {
    this.userRepository = userRepository;
    this.storageProvider = storageProvider;
  }

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new AppError('only authenticated users can change avatar.', 401);
    }
    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }
    const filename = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = filename;

    await this.userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;

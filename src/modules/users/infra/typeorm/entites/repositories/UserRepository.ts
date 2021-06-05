import { getRepository, Repository, Not } from 'typeorm';

import User from '@modules/users/infra/typeorm/entites/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProviderDTO from '@modules/users/dtos/IFindAllProviderDTO';

class UserRepository implements IUsersRepository {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  public async findAllProvider({
    exception_user_id,
  }: IFindAllProviderDTO): Promise<User[]> {
    let providers: User[];
    if (exception_user_id) {
      providers = await this.userRepository.find({
        where: { id: Not(exception_user_id) },
      });
    } else {
      providers = await this.userRepository.find();
    }
    return providers;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne(id);
    return user;
  }

  public async create({
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.userRepository.create({ email, name, password });
    await this.userRepository.save(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}

export default UserRepository;

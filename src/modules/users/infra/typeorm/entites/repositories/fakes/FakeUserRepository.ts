import User from '@modules/users/infra/typeorm/entites/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProviderDTO from '@modules/users/dtos/IFindAllProviderDTO';
import { uuid } from 'uuidv4';

class UserRepository implements IUsersRepository {
  private users: User[] = [];

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);
    return findUser;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = await this.users.find(user => user.id === id);
    return findUser;
  }

  public async findAllProvider({
    exception_user_id,
  }: IFindAllProviderDTO): Promise<User[]> {
    let { users } = this;
    if (exception_user_id) {
      users = this.users.filter(user => user.id !== exception_user_id);
    }
    return users;
  }

  public async create({
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();
    user.id = uuid();
    user.email = email;
    user.name = name;
    user.password = password;
    this.users.push(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);
    this.users[findIndex] = user;
    return user;
  }
}

export default UserRepository;

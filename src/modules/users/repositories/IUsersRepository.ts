import User from '@modules/users/infra/typeorm/entites/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProviderDTO from '@modules/users/dtos/IFindAllProviderDTO';

interface IUsersRepository {
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
  findAllProvider({ exception_user_id }: IFindAllProviderDTO): Promise<User[]>;
}

export default IUsersRepository;

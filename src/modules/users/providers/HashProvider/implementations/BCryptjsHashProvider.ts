import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import { compare, hash } from 'bcryptjs';

class BCryptjsHashProvider implements IHashProvider {
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }

  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }
}

export default BCryptjsHashProvider;

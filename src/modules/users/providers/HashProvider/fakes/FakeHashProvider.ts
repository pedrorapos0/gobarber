import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

class BCryptjsHashProvider implements IHashProvider {
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }

  public async generateHash(payload: string): Promise<string> {
    return payload;
  }
}

export default BCryptjsHashProvider;

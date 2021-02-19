import { container } from 'tsyringe';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import BCryptjsHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptjsHashProvider';

container.registerSingleton<IHashProvider>(
  'HashProvider',
  BCryptjsHashProvider,
);

export default container;

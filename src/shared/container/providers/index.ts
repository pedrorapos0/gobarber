import { container } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import DiskStorageprovider from '@shared/container/providers/StorageProvider/implementations/DiskStorageprovider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageprovider,
);

export default container;

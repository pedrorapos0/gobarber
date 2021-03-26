import { container } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import DiskStorageprovider from '@shared/container/providers/StorageProvider/implementations/DiskStorageprovider';

const providers = {
  disk: DiskStorageprovider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers.disk,
);

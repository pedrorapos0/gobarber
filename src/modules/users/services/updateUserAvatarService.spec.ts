import FakeStorageAvatar from '@shared/container/providers/StorageProvider/fakes/FakeStorageAvatar';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeUsersRepository from '@modules/users/infra/typeorm/entites/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';

describe('UpdateuserAvatar', () => {
  it('should be to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageAvatar = new FakeStorageAvatar();

    const UpdateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageAvatar,
    );
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await UpdateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });
    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageAvatar = new FakeStorageAvatar();

    const UpdateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageAvatar,
    );

    expect(
      UpdateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageAvatar = new FakeStorageAvatar();
    const deleteFile = jest.spyOn(fakeStorageAvatar, 'deleteFile');

    const UpdateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageAvatar,
    );
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await UpdateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await UpdateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });
    expect(deleteFile).toBeCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});

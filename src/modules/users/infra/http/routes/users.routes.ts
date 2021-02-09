import { Router } from 'express';
import multe from 'multer';
import uploadConfig from '@config/uploads';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UsersController from '@modules/users/infra/http/controllers/UsersControllers';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';

const userRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
const upload = multe(uploadConfig);

userRouter.post('/', usersController.create);

userRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default userRouter;

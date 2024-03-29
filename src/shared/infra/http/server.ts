import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import { errors } from 'celebrate';

import uploadConfig from '@config/uploads';
import AppError from '@shared/errors/AppError';
import rateLimiter from '@shared/infra/http/middlewares/RateLimiter';
import routes from '@shared/infra/http/routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use('/', routes);
app.use(errors());
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'Error',
      message: err.message,
    });
  }
  return response.status(500).json({
    status: 'Error',
    message: 'Internal server error.',
    detail: err.message,
  });
});
app.listen(3333, () => console.log('🚀️App listening on port 3333'));

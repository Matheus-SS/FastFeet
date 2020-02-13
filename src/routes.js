import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authenticationMiddleware from './app/middlewares/authentication';
const routes = new Router();

routes.post('/user', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authenticationMiddleware);

routes.put('/user', UserController.update);

export default routes;

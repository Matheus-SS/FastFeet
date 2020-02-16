import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

import authenticationMiddleware from './app/middlewares/authentication';
import Recipient from './app/models/Recipient';

const routes = new Router();

routes.post('/user', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authenticationMiddleware); // authentication middleware
// every routes below need authentication

routes.put('/user', UserController.update);

routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);
routes.get('/recipient', RecipientController.index);
routes.get('/recipient/:id', RecipientController.show);
routes.delete('/recipient/:id', RecipientController.delete);

export default routes;

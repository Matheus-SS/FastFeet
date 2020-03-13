import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import PendingDeliveryController from './app/controllers/PendingDeliveryController';

import authenticationMiddleware from './app/middlewares/authentication';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/user', UserController.store);
routes.post('/session', SessionController.store);

routes.get(
  '/deliveryman/:deliverymanId/pendingDeliveries',
  PendingDeliveryController.index
);

routes.use(authenticationMiddleware); // authentication middleware
// every routes below need authentication

routes.put('/user', UserController.update);

routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);
routes.get('/recipient', RecipientController.index);
routes.get('/recipient/:id', RecipientController.show);
routes.delete('/recipient/:id', RecipientController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.get('/deliveryman', DeliverymanController.index);
routes.get('/deliveryman/:id', DeliverymanController.show);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

routes.post('/order', OrderController.store);
routes.put('/order/:id', OrderController.update);
routes.get('/order', OrderController.index);
routes.get('/order/:id', OrderController.show);
routes.delete('/order/:id', OrderController.delete);

export default routes;

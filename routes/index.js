import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

const routes = express.Router();

routes.get('/status', AppController.getStatus);
routes.get('/stats', AppController.getStats);
routes.get('/users', UsersController.postNew);
routes.get('/connect', AuthController.getConnect);
routes.get('/disconnect', AuthController.getDisconnect);
routes.get('/user/me', UsersController.getMe);

export default routes;

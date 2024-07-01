import express from 'express';
import AppController from '../controllers/AppController';
import UserController from '../controllers/UserController';

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.get('/users', AppController.postNew);

export default router;

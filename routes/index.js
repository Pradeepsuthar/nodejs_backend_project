import express from 'express';
import { registerController, loginController, userController, refreshController } from '../controller';
import isAuthenticated from '../middlewares/auth';

const router = express.Router();


router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/get-user-profile', isAuthenticated, userController.getUserDetails);
router.post('/refresh', refreshController.refresh);
router.post('/logout', isAuthenticated, loginController.logout);


export default router;

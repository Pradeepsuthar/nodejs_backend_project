import express from 'express';
import { registerController, loginController, userController, refreshController } from '../controller';
import isAuthenticated from '../middlewares/auth';
import isAdmin from '../middlewares/admin';
import productController from '../controller/productController';

const router = express.Router();

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/get-user-profile', isAuthenticated, userController.getUserDetails);
router.post('/refresh-token', refreshController.refresh);
router.post('/logout', isAuthenticated, loginController.logout);

router.post('/create-product', [isAuthenticated, isAdmin], productController.createProduct);
router.get('/get-product-by-id/:id', productController.getProductById);
router.get('/get-products', productController.getAllProducts);
router.delete('/delete-product/:id', [isAuthenticated, isAdmin], productController.deleteProdut);
router.put('/update-product/:id', [isAuthenticated, isAdmin], productController.updateProduct);


export default router;

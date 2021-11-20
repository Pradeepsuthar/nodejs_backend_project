import express from 'express';
import { registerController, loginController, userController, refreshController, MasterController, productController, PaymentController } from '../controller';
import isAuthenticated from '../middlewares/auth';
import isAdmin from '../middlewares/admin';

const router = express.Router();

// --------------------- Payments Controller --------------------------------- //

router.post('/create-customer-on-rzrpay', PaymentController.Create_Custer_on_RzrPay);

// --------------------- Products Controller --------------------------------- //

router.get('/get-states', MasterController.Get_States);
router.get('/get-cities', MasterController.Get_Cities);

// --------------------- User Controller -------------------------------------- //

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/get-user-profile', isAuthenticated, userController.getUserDetails);
router.post('/refresh-token', refreshController.refresh);
router.post('/logout', isAuthenticated, loginController.logout);

// --------------------- Products Controller --------------------------------- //

router.post('/create-product', [isAuthenticated, isAdmin], productController.createProduct);
router.post('/get-product-by-id', productController.getProductById);
router.get('/get-products', productController.getAllProducts);
router.delete('/delete-product', [isAuthenticated, isAdmin], productController.deleteProduct);
router.put('/update-product/:id', [isAuthenticated, isAdmin], productController.updateProduct);
router.post('/save-product-image', [isAuthenticated, isAdmin], productController.addProductimage);
router.delete('/delete-product-image', [isAuthenticated, isAdmin], productController.deleteProductImage);
router.get('/get-product-images-by-product-id/:id', productController.getProductImagesByProductId);



export default router;

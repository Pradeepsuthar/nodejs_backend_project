import { Product } from '../models';
import multer from 'multer';
import path from 'path';
import { CustomErrorHandler } from '../services';
import fs from 'fs';
import productSchema from '../validators/productValidator';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/products'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    },
});

const handleMultipartData = multer({
    storage,
    limits: { fileSize: 1000000 * 5 },
}).single('image'); // 5mb

const productController = {

    // Create new product
    async createProduct(req, res, next) {
        // Multipart form data
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            const filePath = req.file.path;
            // validation
            const { error } = productSchema.validate(req.body);
            if (error) {
                // Delete the uploaded file
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) { return next(CustomErrorHandler.serverError(err.message)); }
                });
                return next(error);
                // rootfolder/uploads/products/filename.png
            }

            const { title, subTitle, mrpPrice, salePrice, offer, isAvailable } = req.body;
            let document;
            try {
                document = await Product.create({
                    title,
                    subTitle,
                    mrpPrice,
                    salePrice,
                    offer,
                    isAvailable,
                    image: filePath,
                });
            } catch (err) {
                return next(err);
            }
            res.status(201).json({
                responseCode: 201,
                message: "Product created successfully!",
                data: document
            });
        });
    },

    // Update product
    updateProduct(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            let filePath;
            if (req.file) {
                filePath = req.file.path;
            }

            // validation
            const { error } = productSchema.validate(req.body);
            if (error) {
                // Delete the uploaded file
                if (req.file) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(
                                CustomErrorHandler.serverError(err.message)
                            );
                        }
                    });
                }
                return next(error);
                // rootfolder/uploads/products/filename.png
            }

            const { title, subTitle, mrpPrice, salePrice, offer, isAvailable } = req.body;
            let document;
            try {
                document = await Product.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        title,
                        subTitle,
                        mrpPrice,
                        salePrice,
                        offer,
                        isAvailable,
                        ...(req.file && { image: filePath }),
                    },
                    { new: true }
                );
            } catch (err) {
                return next(err);
            }
            res.status(201).json({
                responseCode: 200,
                message: "Product update successfully!",
                data: document
            });
        });
    },

    // Delete Product
    async deleteProdut(req, res, next) {
        const document = await Product.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        // image delete
        const imagePath = document._doc.image;
        // http://localhost:5000/uploads/1616444052539-425006577.png
        // approot/http://localhost:5000/uploads/1616444052539-425006577.png
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError());
            }
            return res.json({
                responseCode: 200,
                message: "Product delete successfully!"
            });
        });
    },

    // Get all products
    async getAllProducts(req, res, next) {
        let documents;
        // pagination mongoose-pagination
        try {
            documents = await Product.find()
                .select('-__v')
                .sort({ _id: -1 });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({
            responseCode: 200,
            message: "Products fetch successfully!",
            data: documents
        });
    },

    // Get product by ID
    async getProductById(req, res, next) {
        let document;
        try {
            document = await Product.findOne({ _id: req.params.id }).select('-__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({
            responseCode: document == null ? 401 : 200,
            message: document == null ? "Product not available with this product ID" : "Product fetch successfully!",
            data: document
        });
    },

};

export default productController;
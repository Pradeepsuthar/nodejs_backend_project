import { Product, ProductImages } from '../models';
import multer from 'multer';
import path from 'path';
import { CustomErrorHandler, MasterService } from '../services';
import productSchema from '../validators/productValidator';
import productImagesSchema from '../validators/productImagesValidator';

const storageProducts = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/products'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    },
});

// Save product thumbnail
const handleMultipartData = multer({
    storageProducts,
    limits: { fileSize: 1000000 * 2 },
}).single('thumbnail'); // 2mb

// Save Products images
const saveProductImage = multer({
    storageProducts,
    limits: { fileSize: 1000000 * 5 },
}).single('image'); // 5mb

const productController = {

    // Create new product
    async createProduct(req, res, next) {
        // Multipart form data
        handleMultipartData(req, res, async (err) => {

            if (err) { return next(CustomErrorHandler.serverError(err.message)); }

            const filePath = req.file.path;
            // validation
            const { error } = productSchema.validate(req.body);

            if (error) {
                // Delete the uploaded file
                MasterService.Delet_File_From_System(filePath);
                return next(error);
                // rootfolder/uploads/products/filename.png
            }

            const { title, subTitle, mrpPrice, salePrice, offer, isAvailable } = req.body;
            let product;

            try {
                product = await Product.create({
                    title,
                    subTitle,
                    mrpPrice,
                    salePrice,
                    offer,
                    isAvailable,
                    thumbnail: filePath,
                });
            } catch (err) { return next(err); }

            res.status(201).json({
                responseCode: 201,
                message: "Product created successfully!",
                data: product
            });

        });
    },

    // Update product
    updateProduct(req, res, next) {
        handleMultipartData(req, res, async (err) => {

            if (err) { return next(CustomErrorHandler.serverError(err.message)); }

            let filePath;

            if (req.file) { filePath = req.file.path; }

            // validation
            const { error } = productSchema.validate(req.body);

            if (error) {
                // Delete the uploaded file
                if (req.file) { MasterService.Delet_File_From_System(filePath); }
                return next(error);
            }

            const { title, subTitle, mrpPrice, salePrice, offer, isAvailable } = req.body;
            let product;

            try {
                product = await Product.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        title,
                        subTitle,
                        mrpPrice,
                        salePrice,
                        offer,
                        isAvailable,
                        ...(req.file && { thumbnail: filePath }),
                    },
                    { new: true }
                );
            } catch (err) { return next(err); }

            res.status(201).json({
                responseCode: 200,
                message: "Product update successfully!",
                data: product
            });

        });
    },

    // Delete Product
    async deleteProduct(req, res, next) {

        const product_Id = req.body.id;
        let product;
        let product_Images_List;

        if (!product_Id) { return res.json({ responseCode: 400, message: "Product id required to delete the product" }); }

        try {
            product = await Product.findOneAndRemove({ _id: product_Id });
            product_Images_List = await ProductImages.find({ productId: product_Id }).select('-__v');
        } catch (err) { return next(err); }

        if (product != null) {

            const productThumbnailPath = product._doc.thumbnail;

            MasterService.Delet_File_From_System(productThumbnailPath);

            // Delete all product images after delete the product
            for (let image of product_Images_List) {
                const imageDoc = await ProductImages.findOneAndRemove({ _id: image._id });
                const imagePath = imageDoc._doc.image;
                MasterService.Delet_File_From_System(imagePath);
            }

            return res.json({ responseCode: 200, message: "Product delete successfully!" });

        } else { return next(CustomErrorHandler.productNotFound()); }

    },

    // Get all products
    async getAllProducts(req, res, next) {

        let products;
        // pagination mongoose-pagination
        try { products = await Product.find().select('-__v').sort({ _id: -1 }); }
        catch (err) { return next(CustomErrorHandler.serverError()); }

        return res.json({
            responseCode: 200,
            message: "Products fetch successfully!",
            data: products
        });

    },

    // Get product by ID
    async getProductById(req, res, next) {

        let product, productImages;

        try {
            product = await Product.findOne({ _id: req.body.productId }).select('-__v');
            productImages = await ProductImages.find({ productId: req.body.productId }).select('-__v');
        } catch (err) { return next(CustomErrorHandler.productNotFound()); }

        return res.json({
            responseCode: product == null ? 401 : 200,
            message: product == null ? "Product not available with this product ID" : "Product fetch successfully!",
            data: {
                product: product != null ? product._doc : product,
                images: productImages ? productImages : []
            }
        });

    },

    // Add product image
    async addProductimage(req, res, next) {
        // Multipart form data
        saveProductImage(req, res, async (err) => {

            if (err) { return next(CustomErrorHandler.serverError(err.message)); }

            const filePath = req.file.path;

            // validation
            const { error } = productImagesSchema.validate(req.body);

            if (error) {
                // Delete the uploaded file
                MasterService.Delet_File_From_System(filePath);
                return next(error);
                // rootfolder/uploads/products/filename.png
            }

            const { productId, isActive } = req.body;
            let productImage;

            try {
                productImage = await ProductImages.create({
                    productId,
                    isActive,
                    image: filePath,
                });
            } catch (err) { return next(err); }

            res.status(201).json({
                responseCode: 201,
                message: "Product image saved successfully!",
                data: productImage
            });

        });
    },

    // Delete proct image
    async deleteProductImage(req, res, next) {

        const productImage = await ProductImages.findOne({ _id: req.body.image_id });

        if (!productImage) { return next(new Error('Nothing to delete')); }

        const imagePath = productImage._doc.image;

        // image delete
        MasterService.Delet_File_From_System(imagePath);

        return res.json({ responseCode: 200, message: "Product image delete successfully!" });

    },

    // Get product images by product ID
    async getProductImagesByProductId(req, res, next) {

        let productImages;

        try {
            productImages = await ProductImages.find({ productId: req.params.id }).select('-__v');
        } catch (err) { return next(CustomErrorHandler.serverError()); }

        return res.json({
            responseCode: productImages == null ? 401 : 200,
            message: productImages == null ? "Product images not available with this product ID" : "Product images fetch successfully!",
            data: productImages
        });

    },

};

export default productController;
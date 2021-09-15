import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { APP_URL } from '../config';

const productImagesSchema = new Schema({
    productId: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    image: {
        type: String,
        required: true,
        get: (image) => {
            // http://localhost:5000/uploads/products/1616443169266-52350494.png
            if (process.env.ON_HEROKU == 'true') {
                return `${image}`;
            }
            return `${APP_URL}/${image}`;
        },
    },
}, { timestamps: true, toJSON: { getters: true }, id: false });

export default mongoose.model('ProductImages', productImagesSchema, 'products_images');
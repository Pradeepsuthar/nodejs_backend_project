import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { APP_URL } from '../config';

const productSchema = new Schema({
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
    mrpPrice: { type: Number, default: 0 },
    salePrice: { type: Number, default: 0 },
    offer: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: false },
    thumbnail: {
        type: String,
        required: true,
        get: (thumbnail) => {
            // http://localhost:5000/uploads/products/1616443169266-52350494.png
            if (process.env.ON_HEROKU == 'true') {
                return `${thumbnail}`;
            }
            return `${APP_URL}/${thumbnail}`;
        },
    },
}, { timestamps: true, toJSON: { getters: true }, id: false });

export default mongoose.model('Product', productSchema, 'products');
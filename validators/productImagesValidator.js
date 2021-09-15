import Joi from 'joi';

const productImagesSchema = Joi.object({
    productId: Joi.string().required(),
    isActive: Joi.boolean().required(),
    image: Joi.string(),
});

export default productImagesSchema;
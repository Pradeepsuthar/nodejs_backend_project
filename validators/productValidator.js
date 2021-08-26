import Joi from 'joi';

const productSchema = Joi.object({
    title: Joi.string().required(),
    subTitle: Joi.string().required(),
    mrpPrice: Joi.number().required(),
    salePrice: Joi.number().required(),
    offer: Joi.number().required(),
    isAvailable: Joi.boolean().required(),
    image: Joi.string(),
});

export default productSchema;
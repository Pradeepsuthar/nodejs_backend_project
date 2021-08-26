import { User } from '../models';
import CustomErrorHandler from '../services/CustomErrorHandler';

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (user.role === 1) {
            next();
        } else {
            return next(CustomErrorHandler.unAuthorized());
        }
    } catch (err) {
        return next(CustomErrorHandler.serverError(err.message));
    }
};

export default isAdmin;
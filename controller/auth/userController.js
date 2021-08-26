import { User } from "../../models";
import { CustomErrorHandler } from "../../services";

const userController = {
    async getUserDetails(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.user._id }).select('-password -updatedAt -__v');
            console.log("User data:", user);
            if (!user) {
                return next(CustomErrorHandler.notFound());
            }
            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            });
        } catch (err) {
            return next(err);
        }
    }
};

export default userController;
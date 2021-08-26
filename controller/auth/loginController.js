import { User, RefreshToken } from '../../models';
import { CustomErrorHandler, JwtService } from '../../services';
import bcrypt from 'bcrypt';
import { REFRESH_SECRET } from '../../config';
import { loginSchema, refreshSchema } from '../../validators';

const loginController = {

    // Login User
    async login(req, res, next) {

        // Validation
        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            // compare the password
            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            // Toekn
            const access_token = JwtService.sign({ _id: user._id, role: user.role });
            const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

            // database whitelist
            await RefreshToken.create({ token: refresh_token });
            res.json({ access_token, refresh_token });

        } catch (err) {
            return next(err);
        }

    },

    // Logout User
    async logout(req, res, next) {

        // validation
        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            await RefreshToken.deleteOne({ token: req.body.refresh_token });
        } catch (err) {
            return next(new Error('Something went wrong in the database'));
        }

        res.json({ message: "User logout successfully!" });

    }
};


export default loginController;
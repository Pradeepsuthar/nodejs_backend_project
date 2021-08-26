import bcrypt from 'bcrypt';
import { CustomErrorHandler, JwtService } from '../../services';
import { User, RefreshToken } from '../../models';
import { REFRESH_SECRET } from '../../config';
import { registerSchema } from '../../validators';

const registerController = {
    async register(req, res, next) {

        // CHECKLIST
        // [ ] validate the request
        // [ ] authorise the request
        // [ ] check if user is in the database already
        // [ ] prepare model
        // [ ] store in database
        // [ ] generate jwt token
        // [ ] send response

        // Validation
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        // check if user is in the database already
        try {
            const exist = await User.exists({ email: req.body.email });
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
            }
        } catch (err) {
            return next(err);
        }
        const { name, email, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // prepare the model
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        let access_token;
        let refresh_token;
        try {
            const result = await user.save();
            // Token
            access_token = JwtService.sign({ _id: result._id, role: result.role });
            refresh_token = JwtService.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRET);
            // database whitelist
            await RefreshToken.create({ token: refresh_token });
        } catch (err) {
            return next(err);
        }

        res.json({ access_token, refresh_token });
    }
}

export default registerController;
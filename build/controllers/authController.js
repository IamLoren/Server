import bcrypt from 'bcrypt';
import * as authServices from '../services/authServices.js';
import HttpError from '../helpers/HTTPError.js';
const register = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await authServices.findUser({ email });
        if (user) {
            throw HttpError(409, 'Email in use');
        }
        const newUser = await authServices.signUp(req.body);
        await newUser.save();
        res.status(201).json({
            // token,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
        });
    }
    catch (error) {
        next(error);
    }
};
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await authServices.findUser({ email });
        if (!user) {
            throw HttpError(401, 'Invalid email or password');
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw HttpError(401, 'Invalid email or password');
        }
        // const token = await sign(user);
        // res.json({
        //   token,
        //   user: {
        //     email,
        //     createdAt: user.createdAt,
        //     theme: user.theme,
        //     avatarURL: user.avatarURL,
        //   },
        // });
    }
    catch (error) {
        next(error);
    }
};
export default {
    register,
    login,
};
//# sourceMappingURL=authController.js.map
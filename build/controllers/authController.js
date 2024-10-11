import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authServices from '../services/authServices.js';
import HttpError from '../services/HTTPError.js';
import { nanoid } from 'nanoid';
import UserProfile from '../models/UserProfile.js';
const register = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await authServices.findUser({ email });
        if (user) {
            throw HttpError(409, 'Email in use');
        }
        const { JWT_SECRET } = process.env;
        const jwtPayload = nanoid();
        const token = jwt.sign({ jwtPayload }, JWT_SECRET, { expiresIn: '12h' });
        const newUser = await authServices.signUp({ ...req.body, token });
        const newUserProfile = new UserProfile({
            userId: newUser._id,
        });
        await newUserProfile.save();
        res.status(201).json({
            token,
            id: newUser._id,
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
        const foundedUser = await authServices.findUser({ email });
        if (!foundedUser) {
            throw HttpError(401, 'Invalid email or password');
        }
        const passwordCompare = await bcrypt.compare(password, foundedUser.password);
        if (!passwordCompare) {
            throw HttpError(401, 'Invalid email or password');
        }
        console.log(`foundedUser: ${foundedUser}`);
        const { JWT_SECRET } = process.env;
        const jwtPayload = nanoid();
        const token = jwt.sign({ jwtPayload }, JWT_SECRET, { expiresIn: '12h' });
        const userProfile = await UserProfile.findOne({
            userId: foundedUser._id,
        });
        console.log(`userProfile: ${userProfile}`);
        res.json({
            token,
            user: {
                _id: foundedUser._id,
                email: foundedUser.email,
                firstName: foundedUser.firstName,
                lastName: foundedUser.lastName,
                theme: userProfile?.theme,
                avatarURL: userProfile?.avatarURL,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
const getCurrent = async (req, res, next) => {
    try {
        const { email, avatarURL, theme } = req.user;
        res.status(200).json({ email, avatarURL, theme });
    }
    catch (error) {
        next(error);
    }
};
const logout = async (req, res, next) => {
    console.log(req.body);
    try {
        const { id } = req;
        await authServices.setToken(id);
        res.status(204).end();
    }
    catch (error) {
        next(error);
    }
};
export default {
    register,
    login,
    getCurrent,
    logout
};
//# sourceMappingURL=authController.js.map
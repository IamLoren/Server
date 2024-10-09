var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HTTPError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield authServices.findUser({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }
    const newUser = yield authServices.signUp(req.body);
    yield newUser.save();
    res.status(201).json({
        // token,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
    });
});
export default {
    register: ctrlWrapper(register),
};

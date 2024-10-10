import bcrypt from "bcrypt";
import UserCredentials from "../models/UserCredentials.js";
export const signUp = async (data) => {
    const { password } = data;
    const hashPassword = await bcrypt.hash(password, 6);
    return UserCredentials.create({ ...data, password: hashPassword });
};
export const findUser = (filter) => {
    return UserCredentials.findOne(filter);
};
export const setToken = (id, token = "") => {
    return UserCredentials.findByIdAndUpdate(id, { token });
};
//# sourceMappingURL=authServices.js.map
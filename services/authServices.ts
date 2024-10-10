import bcrypt from "bcrypt";
import {IUserCredentials, signUpArguments} from "../types/authTypes"
import { FilterQuery } from "mongoose";
import UserCredentials from "../models/UserCredentials.js";

export const signUp = async (data:signUpArguments) => {
  const { password } = data;
  const hashPassword = await bcrypt.hash(password, 6);
  return UserCredentials.create({ ...data, password: hashPassword });
};

export const findUser = (filter:FilterQuery<IUserCredentials>) => {
    return UserCredentials.findOne(filter);
  };

export const setToken = (id: string, token = "") => {
  return UserCredentials.findByIdAndUpdate(id, { token });
};
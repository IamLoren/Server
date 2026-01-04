import bcrypt from "bcrypt";
import { ObjectId, Types } from 'mongoose';
import {IUserCredentials, signUpArguments} from "../types/authTypes.js"
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

  export const findUserById = (id) => {
    return UserCredentials.findById(id);
  };

  export const setToken = async (id: ObjectId) => {
    const token = ""; 
    const result = await UserCredentials.findByIdAndUpdate(id, { token });
    if (!result) {
        throw new Error("User not found");
    }
};
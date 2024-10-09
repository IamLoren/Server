import { Request, Response } from "express";
import { nanoid } from "nanoid";
import * as authServices from "../services/authServices.js";
import { signUpArguments } from "../types";
import HttpError from "../helpers/HTTPError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

interface RegisterReq extends Request {
  body: signUpArguments;
}

interface RegisterRes extends Response {
  status: (statusCode: number) => this;
  json: (body: {
    // token: string | null;
    firstName: string;
    lastName: string;
    email: string;
    role: "admin" | "user";
  }) => this;
}

const register = async (req: RegisterReq, res: RegisterRes) => {

  const { email } = req.body;

  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
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
};

export default {
  register: ctrlWrapper(register),
};
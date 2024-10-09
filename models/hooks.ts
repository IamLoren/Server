import { CallbackError } from "mongoose";
import { NextFunction } from "express";

export const handleSaveError = (error: CallbackError, data: any, next: NextFunction) => {
    (error as any).status = 400; 
    next();
  };

export const setUpdateSetting = function (this: any, next: Function) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
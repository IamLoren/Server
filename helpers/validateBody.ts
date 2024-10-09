import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi'; 
import HttpError from './HTTPError.js';

const validateBody = (schema: Schema) => {
  const func = (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body); 
    if (error) {
      next(HttpError(400, error.message)); 
    } else {
      next(); 
    }
  };

  return func;
};

export default validateBody;
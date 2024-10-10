import { Request, NextFunction } from 'express';
import { Schema } from 'joi';
declare const validateBody: (schema: Schema) => (req: Request, _: any, next: NextFunction) => void;
export default validateBody;

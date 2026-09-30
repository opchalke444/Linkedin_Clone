import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export function validate(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

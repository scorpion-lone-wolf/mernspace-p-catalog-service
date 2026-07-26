import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const parseJsonFields =
  (fields: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const field of fields) {
        if (req.body[field]) {
          req.body[field] = JSON.parse(req.body[field]);
        }
      }
      next();
    } catch {
      next(createHttpError(400, "Invalid JSON"));
    }
  };

export default parseJsonFields;

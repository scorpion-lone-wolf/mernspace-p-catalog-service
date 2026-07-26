import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import type { ZodType } from "zod";

const fileValidator =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(createHttpError(400, "Image is required"));
    }

    const result = schema.safeParse(req.file);

    if (!result.success) {
      const issue = result.error.issues[0];

      const path = issue?.path.join(".") ?? "body";
      const message = issue?.message ?? "Invalid request body";

      return next(createHttpError(400, `${path}: ${message}`));
    }

    next();
  };

export default fileValidator;

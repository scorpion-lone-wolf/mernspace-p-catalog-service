import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import type { ZodType } from "zod";

const categoryValidator =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const issue = result.error.issues[0];

      const path = issue?.path.join(".") ?? "body";
      const message = issue?.message ?? "Invalid request body";

      return next(createHttpError(400, `${path}: ${message}`));
    }

    req.body = result.data;
    next();
  };

export default categoryValidator;

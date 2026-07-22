import type { NextFunction, Request, Response } from "express";
import type { HttpError } from "http-errors";
import config from "../config/index.js";
import { logger } from "../config/logger.js";

export const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errorId = crypto.randomUUID();

  const statusCode = err.status || 500;
  const isProduction = config.NODE_ENV === "production";
  const message = isProduction ? `An unexpected error occurred.` : err.message;

  logger.error(err.message, {
    id: errorId,
    error: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    errors: [
      {
        ref: errorId,
        type: err.name,
        msg: message,
        path: req.path,
        location: "server",
        stack: isProduction ? null : err.stack,
      },
    ],
  });
};

import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import type { UserRole } from "../enums/index.js";

const authorized =
  (roles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    //  assuming user is already authenticated
    //  still check if the user is authorized
    if (!req.user) {
      throw createHttpError(401, "Unauthorized");
    }
    if (!roles.includes(req.user.role as UserRole)) {
      throw createHttpError(403, "Forbidden");
    }
    next();
  };

export default authorized;

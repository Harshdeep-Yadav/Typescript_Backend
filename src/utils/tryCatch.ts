import { ControllerType } from "../types/types";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const TryCatch =
  (func: ControllerType): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };

import { Request, Response, NextFunction, RequestHandler } from "express";

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

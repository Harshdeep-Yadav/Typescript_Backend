import { Response } from "express";
import ErrorHandler from "../utils/error-utility-class";

export const errorMiddleware = (
  err: Error | ErrorHandler,
  res: Response
): Response => {
  // Default error values
  const statusCode = (err as ErrorHandler).statusCode || 500;
  const message = (err as ErrorHandler).message || "Internal Server Error";

  // Handle specific error types (optional)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

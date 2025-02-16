import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Ocorreu um erro.";

  return res.status(statusCode).json({
    success: false,
    message: message,
  });
}

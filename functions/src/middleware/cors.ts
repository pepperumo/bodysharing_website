import cors from "cors";
import {logger} from "../utils/logger.js";
import {Request, Response, NextFunction} from "express";

export const corsHandler = cors({
  origin: true, // Allows all origins
  methods: ["POST", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Origin",
    "X-Requested-With",
    "Accept",
    "Authorization",
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
});

// Log middleware for debugging CORS issues
export const logCorsDebug = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.debug("🔒 CORS Headers:", {
    origin: req.headers.origin,
    method: req.method,
    contentType: req.headers["content-type"],
  });
  next();
};

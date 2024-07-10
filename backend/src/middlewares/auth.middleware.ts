import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { extractToken } from "@services/auth.service";
import logger from "../utils/logger";
import { errorMessages } from "@utils/constants";
import { HttpStatusCode } from "axios";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res
        .status(HttpStatusCode.Unauthorized)
        .json({ message: errorMessages.UNAUTHORIZED });
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as string);
    if (!decodedToken) {
      throw new Error(errorMessages.INVALID_TOKEN);
    }

    return next();
  } catch (error) {
    logger.error({ error }, "Authentication error");
    return res
      .status(HttpStatusCode.Unauthorized)
      .json({ message: errorMessages.UNAUTHORIZED });
  }
};

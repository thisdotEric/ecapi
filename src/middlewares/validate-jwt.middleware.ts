// For some reason, process.env does not pick up values from .env file
// and needed to re-import dotenv/package to work.
import 'dotenv/config';

import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

export const mustHaveValidJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);

    req.user = {
      user_id: (decoded as JwtPayload).user_id,
    };

    return next();
  } catch (error) {
    return res.sendStatus(500);
  }
};

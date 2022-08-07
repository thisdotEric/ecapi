import { NextFunction, Request, Response } from 'express';

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

  req.user = {
    user_id: 'test_id',
  };

  return next();
};

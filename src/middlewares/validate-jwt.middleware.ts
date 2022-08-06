import { NextFunction, Request, Response } from 'express';

export const mustHaveValidJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) res.status(401).send('Unauthorized');

  req.user = {
    user_id: 'test_id',
  };

  next();
};

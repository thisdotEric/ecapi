import { NextFunction, Request, Response } from 'express';
import { ILoginCredential } from '../interfaces/login.interface';

export const mustProvideValidLoginCredentials = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body) {
    res.status(400);
    res.send('Missing email and password');
    return;
  }

  const { email, password } = req.body as ILoginCredential;

  if (email === '' || email == null || password === '' || password == null) {
    res.status(400);
    res.send('Invalid login credentials');
  } else return next();
};

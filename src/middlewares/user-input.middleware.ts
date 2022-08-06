import { NextFunction, Request, Response } from 'express';
import { ICreateUserInput } from 'src/modules/user/user.model';

const hasNoValue = (property: any): boolean => {
  return property == undefined || property === '';
};

const passwordDoesNotMatched = (
  password: string,
  confirm_password: string
): boolean => {
  return password !== confirm_password;
};

export const validateCreateUserInput = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const { name, email, password, confirm_password } =
    req.body as ICreateUserInput;

  if (
    hasNoValue(name) ||
    hasNoValue(email) ||
    hasNoValue(password) ||
    hasNoValue(confirm_password)
  ) {
    res.status(400).send('Null or empty values not allowed');
  } else if (passwordDoesNotMatched(password, confirm_password)) {
    res.status(400).send('Password does not match');
  } else next();
};

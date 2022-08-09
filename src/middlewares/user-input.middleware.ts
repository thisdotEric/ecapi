import { NextFunction, Request, Response } from 'express';
import { ICreateUserInput } from 'src/modules/user/user.model';
import { z } from 'zod';

const passwordDoesNotMatched = (
  password: string,
  confirm_password: string
): boolean => {
  return password !== confirm_password;
};

export const CreateUserInputSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  confirm_password: z.string(),
});

export const emailSchema = z.string().email();

export const validateCreateUserInput = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  if (req.body == undefined) {
    return res.sendStatus(400);
  }

  let userInput: ICreateUserInput = CreateUserInputSchema.parse(req.body);

  if (userInput == undefined) {
    res.status(400);
    return res.send('Invalid request body form');
  }

  const { email, password, confirm_password } = userInput;

  if (passwordDoesNotMatched(password, confirm_password)) {
    res.status(400);
    return res.send('Password does not match');
  }

  if (emailSchema.parse(email) === '') {
    res.status(400);
    return res.send('Invalid email');
  }

  return next();
};

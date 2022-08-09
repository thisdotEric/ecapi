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
  email: z.string().email(),
  password: z.string(),
  confirm_password: z.string(),
});

export const emailSchema = z.string().email();

export const validateCreateUserInput = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const { success } = CreateUserInputSchema.safeParse(req.body);

  if (!success) {
    res.status(400);
    return res.send('Invalid request body form');
  }

  const { password, confirm_password } = req.body as ICreateUserInput;

  if (passwordDoesNotMatched(password, confirm_password)) {
    res.status(400);
    return res.send('Password does not match');
  }

  return next();
};

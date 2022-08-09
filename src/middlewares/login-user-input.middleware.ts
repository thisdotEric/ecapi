import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const mustHaveValidLoginInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { success } = LoginInputSchema.safeParse(req.body);

  if (!success) {
    res.status(400);
    return res.send('Invalid password or email form');
  }

  return next();
};

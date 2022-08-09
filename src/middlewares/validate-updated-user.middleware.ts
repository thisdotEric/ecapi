import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const UpdatedUserSchema = z.object({
  name: z.optional(z.string()),
  email: z.optional(z.string().email()),
});

export const mustBeValidUpdatedUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { success } = UpdatedUserSchema.safeParse(req.body);

  if (!success) {
    res.status(400);
    return res.send('Invalid updated user details');
  }

  return next();
};

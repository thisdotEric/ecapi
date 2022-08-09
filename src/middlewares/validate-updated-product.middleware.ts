import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const UpdatedProductSchema = z.object({
  name: z.optional(z.string()),
  description: z.optional(z.string()),
  price: z.optional(z.number()),
  tags: z.optional(z.array(z.string())),
});

export const mustBeValidUpdatedProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { success } = UpdatedProductSchema.safeParse(req.body);

  if (!success) {
    res.status(400);
    return res.send('Invalid product details');
  }

  return next();
};

import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  tags: z.array(z.string()),
});

export const mustBeValidProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { success } = ProductSchema.safeParse(req.body);

  if (!success) {
    res.status(400);
    return res.send('Invalid/Incomplete product details');
  }

  return next();
};

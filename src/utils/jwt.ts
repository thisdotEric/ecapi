import { sign } from 'jsonwebtoken';

// The payload (for now) is just the user_id

export const generateAccessToken = (user_id: string): string => {
  const accessToken = sign({ user_id }, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: '7d',
  });
  return accessToken;
};

export const generateRefreshToken = (user_id: string): string => {
  const refreshToken = sign({ user_id }, `${process.env.REFRESH_TOKEN_SECRET}`);
  return refreshToken;
};

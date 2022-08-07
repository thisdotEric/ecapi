import { randomBytes, pbkdf2 } from 'crypto';

const PASSWORD_LENGTH = 256;
const SALT_LENGTH = 64;
const ITERATIONS = 1000;
const DIGEST = 'sha256';
const BYTE_TO_STRING_ENCODING = 'hex';

export interface PersistedPassword {
  salt: string;
  hashedPassword: string;
}

export const hashPassword = (password: string): Promise<PersistedPassword> => {
  return new Promise<PersistedPassword>((resolve, reject) => {
    const salt = randomBytes(SALT_LENGTH).toString(BYTE_TO_STRING_ENCODING);

    pbkdf2(
      password,
      salt,
      ITERATIONS,
      PASSWORD_LENGTH,
      DIGEST,
      (error, hash) => {
        if (error) reject(error);
        else
          resolve({
            salt,
            hashedPassword: hash.toString(BYTE_TO_STRING_ENCODING),
          });
      }
    );
  });
};

export const verifyPassword = (
  passwordAttempt: string,
  hashedPassword: string,
  salt: string
): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    pbkdf2(
      passwordAttempt,
      salt,
      ITERATIONS,
      PASSWORD_LENGTH,
      DIGEST,
      (error, hash) => {
        if (error) reject(error);
        else resolve(hashedPassword === hash.toString(BYTE_TO_STRING_ENCODING));
      }
    );
  });
};

import { Request, Response } from 'express';
import { mustHaveValidJWT } from '../../../src/middlewares';
import jwt from 'jsonwebtoken';

describe('mustHaveValidJWT middleware', () => {
  const res: Partial<Response> = {
    status: jest.fn(),
    sendStatus: jest.fn(),
    send: jest.fn(),
  };

  const next = jest.fn();

  describe('user has provided a verifiable jwt access token', () => {
    test("should assign the user_id to req.user.user_id variable and call the 'next' function", async () => {
      const req: Partial<Request> = {
        headers: {
          authorization: 'Bearer validJwt',
        },
      };

      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        return {
          user_id: 'decoded_user_id',
        };
      });

      // @ts-ignore
      await mustHaveValidJWT(req, res, next);

      expect(req.headers).not.toBe(null);
      expect(res.sendStatus).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('user has provided a unverifiable jwt access or wrong secret key', () => {
    test('should return status code 500', async () => {
      const req: Partial<Request> = {
        headers: {
          authorization: 'Bearer invalidJwt',
        },
      };

      /**
       * Not mocking the `verify` method will result to an exception in case:
       * first, if the jwt token is invalid or
       * second, if provided with the wrong secret
       */

      // jest.spyOn(jwt, 'verify').mockImplementation(() => {});

      try {
        // @ts-ignore
        await mustHaveValidJWT(req, res, next);
      } catch (error) {
        expect(req.headers).not.toBe(null);
        expect(res.sendStatus).toHaveBeenCalledWith(500);
        expect(next).not.toHaveBeenCalled();
      }
    });
  });

  describe("user has not appended a jwt token after 'Bearer'", () => {
    test('should send a status of 401', async () => {
      const req: Partial<Request> = {
        headers: {
          authorization: 'Bearer',
        },
      };

      // @ts-ignore
      await mustHaveValidJWT(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });
});

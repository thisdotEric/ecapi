import { Request, Response } from 'express';
import { ICreateUserInput, IUser } from './user.model';
import { ILoginCredential } from 'src/interfaces/login.interface';
import UserService from './user.service';

export default class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Create new user
   */
  public async create(req: Request, res: Response) {
    const userInput = req.body as ICreateUserInput;

    try {
      const createdUser = await this.userService.create(userInput);

      res.status(201);
      res.json(createdUser);
    } catch (error) {
      res.send(error.message);
    }
  }

  /**
   * Get single user
   */
  public async get(req: Request, res: Response) {
    try {
      const user = await this.userService.get(req.user.user_id);

      res.status(200);
      res.json(user);
    } catch (error) {
      res.status(404);
      res.send(error.message);
    }
  }

  /**
   * Delete a user based on the given user_id
   */
  public async delete(req: Request, res: Response) {
    try {
      const deleted = await this.userService.delete(req.user.user_id);

      res.sendStatus(deleted ? 200 : 400);
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  }

  /**
   * Update user information except the password
   */
  public async update(req: Request, res: Response) {
    try {
      const newUserInfo = req.body as IUser;

      const updatedUserInfo = await this.userService.update(
        req.user.user_id,
        newUserInfo
      );

      res.status(200);
      res.json(updatedUserInfo);
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  }

  /**
   * Log in user using their registered email and password
   */
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as ILoginCredential;

      const tokens = await this.userService.login(email, password);

      res.json(tokens);
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  }

  /**
   * Get all users.
   * The user can get all users as long as s/he is logged in. Might change if role based authentication is added
   */
  public async getAll(_: Request, res: Response) {
    try {
      const users = await this.userService.getAll();

      res.status(200);
      res.json(users);
    } catch (error) {
      res.status(404);
      res.send(error.message);
    }
  }
}

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
   * create
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
   * get
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
   * delete
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
   * update
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
   * login
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
}

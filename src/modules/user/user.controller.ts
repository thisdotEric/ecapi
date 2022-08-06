import { Request, Response } from 'express';
import { ICreateUserInput } from './user.model';
import { IUserService } from './user.interface';

export default class UserController {
  private readonly userService: IUserService;

  constructor(userService: IUserService) {
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
      res.send(error.message);
    }
  }
}

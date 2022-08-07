import { ICreateUserInput, IUser } from 'src/modules/user/user.model';

export interface ILoginCredential {
  email: IUser['email'];
  password: ICreateUserInput['password'];
}

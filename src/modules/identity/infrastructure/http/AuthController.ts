import { Request, Response } from 'express';
import { RegisterUser } from '../../application/RegisterUser';
import { LoginUser } from '../../application/LoginUser';
import { userRepository } from '../../../../shared/infrastructure/persistence/RepositoryContainer';
import { successResponse } from '../../../../shared/response';

export class AuthController {
  private registerUser: RegisterUser;
  private loginUser: LoginUser;

  constructor() {
    this.registerUser = new RegisterUser(userRepository);
    this.loginUser = new LoginUser(userRepository);
  }

  register = async (req: Request, res: Response) => {
    try {
      const { email, name, password } = req.body;
      const user = await this.registerUser.execute({ email, name, password });
      res.status(201).json(successResponse({ id: user.id, email: user.email, name: user.name }, 'User registered successfully'));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.loginUser.execute({ email, password });
      res.status(200).json(successResponse(result, 'Login successful'));
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };
}

import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../../../shared/response';
import { userService } from '../../application/user.service';

class UserController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.findAll();
      res.status(200).json(successResponse(users, 'Users retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();

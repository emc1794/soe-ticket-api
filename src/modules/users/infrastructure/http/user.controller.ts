import { Response, NextFunction } from 'express';
import { successResponse } from '../../../../shared/response';
import { userRepository } from '../../../../shared/infrastructure/persistence/RepositoryContainer';
import { AuthRequest } from '../../../../middlewares/auth.middleware';

class UserController {
  public async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await userRepository.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(successResponse({
        id: user.id,
        email: user.email,
        name: user.name
      }, 'User profile retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();

import { UserRepository } from '../../users/domain/UserRepository';
import bcrypt from 'bcrypt';
import { JWTManager, jwtManager } from '../../../shared/infrastructure/auth/JWTManager';

export class LoginUser {
  constructor(
    private userRepository: UserRepository,
    private jwt: JWTManager = jwtManager
  ) {}

  async execute(params: { email: string; password: string }): Promise<{ token: string; user: { id: string; email: string; name: string } }> {
    const user = await this.userRepository.findByEmail(params.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(params.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.jwt.generate({ userId: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}

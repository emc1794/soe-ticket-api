import { User } from '../domain/User';
import { UserRepository } from '../domain/UserRepository';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

export class RegisterUser {
  constructor(private userRepository: UserRepository) {}

  async execute(params: { email: string; name: string; password: string }): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(params.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(params.password, 10);
    const user = new User(
      uuid(),
      params.email,
      hashedPassword,
      params.name
    );

    await this.userRepository.save(user);
    return user;
  }
}

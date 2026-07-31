import { User } from '../../domain/User';
import { UserRepository } from '../../domain/UserRepository';
import { UserModel } from '../../../../shared/infrastructure/persistence/sequelize/UserModel';

export class MySQLUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    await UserModel.upsert({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
    });
  }

  async findById(id: string): Promise<User | null> {
    const model = await UserModel.findByPk(id, { raw: true });
    if (!model) return null;
    return this.toDomain(model);
  }

  async findByEmail(email: string): Promise<User | null> {
    const model = await UserModel.findOne({ where: { email }, raw: true });
    if (!model) return null;
    return this.toDomain(model);
  }

  private toDomain(model: UserModel): User {
    return new User(
      model.id,
      model.email,
      model.password,
      model.name
    );
  }
}

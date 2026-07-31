import jwt from 'jsonwebtoken';
import { config } from '../../../config';
import type {StringValue} from "ms";

export class JWTManager {
  private static readonly SECRET = config.JWT.SECRET;
  private static readonly EXPIRES_IN = config.JWT.EXPIRES_IN;

  generate(payload: { userId: string; email: string }): string {
    return jwt.sign(payload, JWTManager.SECRET, { expiresIn: JWTManager.EXPIRES_IN as StringValue });
  }

  verify(token: string): any {
    try {
      return jwt.verify(token, JWTManager.SECRET);
    } catch (error) {
      return null;
    }
  }
}

export const jwtManager = new JWTManager();

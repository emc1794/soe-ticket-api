import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

class Config {
  private static instance: Config;

  public readonly PORT: number;
  public readonly NODE_ENV: string;
  public readonly DB: {
    HOST: string;
    PORT: number;
    USER: string;
    PASS: string;
    NAME: string;
  };
  public readonly REDIS: {
    HOST: string;
    PORT: number;
    PASS: string;
  };
  public readonly JWT: {
    SECRET: string;
    REFRESH_SECRET: string;
    EXPIRES_IN: string;
    REFRESH_EXPIRES_IN: string;
  };

  private constructor() {
    this.PORT = Number(process.env.PORT) || 3000;
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    
    this.DB = {
      HOST: process.env.DB_HOST || 'localhost',
      PORT: Number(process.env.DB_PORT) || 3306,
      USER: process.env.DB_USER || 'root',
      PASS: process.env.DB_PASSWORD || '',
      NAME: process.env.DB_NAME || 'ticketwave',
    };

    this.REDIS = {
      HOST: process.env.REDIS_HOST || 'localhost',
      PORT: Number(process.env.REDIS_PORT) || 6379,
      PASS: process.env.REDIS_PASSWORD || '',
    };

    this.JWT = {
      SECRET: process.env.JWT_SECRET || 'secret',
      REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
      REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    };
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export const config = Config.getInstance();

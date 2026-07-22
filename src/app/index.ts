import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { config } from '../config';
import { logger } from '../utils/logger';
import { errorMiddleware } from '../middlewares/error.middleware';
import { successResponse } from '../shared/response';
import { swaggerSpec } from '../config/swagger';
import apiRoutes from '../routes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    if (config.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }
  }

  private setupRoutes(): void {
    // Swagger Documentation
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Health Check
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json(successResponse({ status: 'UP', timestamp: new Date() }, 'Health check passed'));
    });

    // API Routes
    this.app.use('/api/v1', apiRoutes);
  }

  private setupErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  public listen(): void {
    this.app.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT} in ${config.NODE_ENV} mode`);
    });
  }
}

export default new App();

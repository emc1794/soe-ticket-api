import { Sequelize } from 'sequelize';
import { config } from '../config';
import { logger } from '../utils/logger';

const sequelize = new Sequelize(
  config.DB.NAME,
  config.DB.USER,
  config.DB.PASS,
  {
    host: config.DB.HOST,
    port: config.DB.PORT,
    dialect: 'mysql',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info('MySQL Database connected successfully.');
  } catch (error) {
    logger.error('Unable to connect to the MySQL database:', error);
    process.exit(1);
  }
};

export default sequelize;

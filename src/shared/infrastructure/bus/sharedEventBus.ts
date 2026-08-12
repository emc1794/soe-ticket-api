import { RabbitMQEventBus } from './RabbitMQEventBus';
import { config } from '../../../config';

export const eventBus = new RabbitMQEventBus(config.RABBITMQ.URL);

import { connect, Channel, ChannelModel } from 'amqplib';
import { DomainEvent, DomainEventSubscriber } from '../../domain/events/DomainEvent';
import { EventBus } from '../../domain/bus/EventBus';
import { logger } from '../../../utils/logger';

const EXCHANGE = 'domain_events';

export class RabbitMQEventBus implements EventBus {
  private connection?: ChannelModel;
  private channel?: Channel;

  constructor(private readonly url: string) {}

  async connect(): Promise<void> {
    this.connection = await connect(this.url);
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    logger.info('RabbitMQ event bus connected.');
  }

  async publish(events: DomainEvent[]): Promise<void> {
    const channel = this.requireChannel();
    for (const event of events) {
      const routingKey = event.eventName();
      channel.publish(EXCHANGE, routingKey, Buffer.from(JSON.stringify(event)), {
        contentType: 'application/json',
        persistent: true,
      });
    }
  }

  addSubscribers(subscribers: DomainEventSubscriber<DomainEvent>[]): void {
    subscribers.forEach((subscriber) => {
      subscriber.subscribedTo().forEach((eventClass) => {
        void this.bindSubscriber(subscriber, eventClass.EVENT_NAME);
      });
    });
  }

  async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }

  private requireChannel(): Channel {
    if (!this.channel) {
      throw new Error('RabbitMQEventBus is not connected. Call connect() before publishing or subscribing.');
    }
    return this.channel;
  }

  private async bindSubscriber(subscriber: DomainEventSubscriber<DomainEvent>, routingKey: string): Promise<void> {
    const channel = this.requireChannel();
    const { queue } = await channel.assertQueue('', { exclusive: true, autoDelete: true });
    await channel.bindQueue(queue, EXCHANGE, routingKey);

    await channel.consume(queue, (msg) => {
      if (!msg) return;
      void (async () => {
        try {
          const event = JSON.parse(msg.content.toString()) as DomainEvent;
          await subscriber.on(event);
          channel.ack(msg);
        } catch (error) {
          logger.error(`Error handling event "${routingKey}":`, error);
          channel.nack(msg, false, false);
        }
      })();
    });
  }
}

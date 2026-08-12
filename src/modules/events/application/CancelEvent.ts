import { EventRepository } from '../domain/EventRepository';
import { EventBus } from '../../../shared/domain/bus/EventBus';
import { EventCancelled } from '../domain/events/EventCancelled';

export class CancelEvent {
  constructor(
    private eventRepository: EventRepository,
    private eventBus: EventBus
  ) {}

  async execute(id: string): Promise<void> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new Error(`Event with id ${id} not found`);
    }

    event.cancel();
    await this.eventRepository.save(event);

    await this.eventBus.publish([
      new EventCancelled(event.id, event.title)
    ]);
  }
}

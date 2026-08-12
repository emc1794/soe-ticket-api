import { Event, EventType } from '../domain/Event';
import { EventRepository } from '../domain/EventRepository';
import { EventBus } from '../../../shared/domain/bus/EventBus';
import { EventUpdated } from '../domain/events/EventUpdated';

export class UpdateEvent {
  constructor(
    private eventRepository: EventRepository,
    private eventBus: EventBus
  ) {}

  async execute(id: string, params: {
    title?: string;
    description?: string;
    date?: string;
    venueId?: string;
    artist?: string;
    city?: string;
    type?: EventType;
    metadata?: Record<string, any>;
  }): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new Error(`Event with id ${id} not found`);
    }

    const updatedEvent = new Event(
      event.id,
      params.title ?? event.title,
      params.description ?? event.description,
      params.date ? new Date(params.date) : event.date,
      params.venueId ?? event.venueId,
      params.artist ?? event.artist,
      params.city ?? event.city,
      params.type ?? event.type,
      params.metadata ?? event.metadata,
      event.status
    );

    await this.eventRepository.save(updatedEvent);

    await this.eventBus.publish([
      new EventUpdated(
        updatedEvent.id,
        updatedEvent.title,
        updatedEvent.date,
        updatedEvent.venueId
      )
    ]);

    return updatedEvent;
  }
}

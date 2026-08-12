import { Event, EventType } from '../domain/Event';
import { EventRepository } from '../domain/EventRepository';
import { v4 as uuid } from 'uuid';

export class CreateEvent {
  constructor(private eventRepository: EventRepository) {}

  async execute(params: {
    title: string;
    description: string;
    date: string;
    venueId: string;
    artist: string;
    city: string;
    type?: EventType;
    metadata?: Record<string, any>;
  }): Promise<Event> {
    const event = new Event(
      uuid(),
      params.title,
      params.description,
      new Date(params.date),
      params.venueId,
      params.artist,
      params.city,
      params.type || EventType.GENERAL,
      params.metadata || {}
    );
    await this.eventRepository.save(event);
    return event;
  }
}

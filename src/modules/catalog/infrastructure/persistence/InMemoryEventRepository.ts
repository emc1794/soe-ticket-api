import { Event } from '../../domain/Event';
import { EventRepository } from '../../domain/EventRepository';

export class InMemoryEventRepository implements EventRepository {
  private events: Event[] = [
    new Event('1', 'Rock Concert', 'A great rock concert', new Date('2026-08-01'), 'venue-1', 'Rock Band', 'Madrid'),
    new Event('2', 'Jazz Night', 'Smooth jazz music', new Date('2026-08-05'), 'venue-2', 'Jazz Quartet', 'Barcelona'),
  ];

  async save(event: Event): Promise<void> {
    this.events.push(event);
  }

  async findById(id: string): Promise<Event | null> {
    return this.events.find(e => e.id === id) || null;
  }

  async findAll(): Promise<Event[]> {
    return this.events;
  }

  async search(query: { city?: string; artist?: string; date?: Date }): Promise<Event[]> {
    return this.events.filter(e => {
      let matches = true;
      if (query.city) matches = matches && e.city.toLowerCase().includes(query.city.toLowerCase());
      if (query.artist) matches = matches && e.artist.toLowerCase().includes(query.artist.toLowerCase());
      if (query.date) matches = matches && e.date.toDateString() === query.date.toDateString();
      return matches;
    });
  }
}

import { EventRepository } from '../domain/EventRepository';
import { Event } from '../domain/Event';

export class SearchEvents {
  constructor(private eventRepository: EventRepository) {}

  async execute(query: { 
    city?: string; 
    artist?: string; 
    venueName?: string; 
    startDate?: string; 
    endDate?: string 
  }): Promise<Event[]> {
    const dateRange = (query.startDate && query.endDate) 
      ? { start: new Date(query.startDate), end: new Date(query.endDate) } 
      : undefined;

    const searchOptions = {
      city: query.city as string,
      artist: query.artist as string,
      venueName: query.venueName as string,
      dateRange: dateRange as { start: Date, end: Date } || undefined
    }

    if (dateRange) {
      searchOptions.dateRange = dateRange;
    }

    return this.eventRepository.search(searchOptions);
  }
}

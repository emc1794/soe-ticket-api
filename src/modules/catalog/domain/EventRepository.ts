import { Event } from './Event';

export interface EventRepository {
  save(event: Event): Promise<void>;
  findById(id: string): Promise<Event | null>;
  findAll(): Promise<Event[]>;
  search(query: { 
    city?: string; 
    artist?: string; 
    venueName?: string; 
    dateRange?: { start: Date; end: Date } 
  }): Promise<Event[]>;
}

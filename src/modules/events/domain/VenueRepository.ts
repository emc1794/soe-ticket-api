import { Venue } from './Venue';

export interface VenueRepository {
  save(venue: Venue): Promise<void>;
  findById(id: string): Promise<Venue | null>;
}

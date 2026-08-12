import { VenueAdapter, SeatingMap, VenueAvailability } from '../../../domain/venue/VenueAdapter';

export class GenericVenueAdapter implements VenueAdapter {
  readonly provider = 'generic';

  async syncSeatingMap(venueId: string): Promise<SeatingMap> {
    console.log(`[Venue Plugin Manager] (generic) Syncing seating map for venue ${venueId}`);
    return { venueId, provider: this.provider, sections: [] };
  }

  async getRealTimeAvailability(venueId: string): Promise<VenueAvailability> {
    console.log(`[Venue Plugin Manager] (generic) Fetching real-time availability for venue ${venueId}`);
    return { venueId, provider: this.provider, availableSeats: [], checkedAt: new Date() };
  }
}

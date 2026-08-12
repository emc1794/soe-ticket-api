import { VenueAdapter, SeatingMap, VenueAvailability } from '../../../domain/venue/VenueAdapter';

export class LegacyVenueAdapter implements VenueAdapter {
  readonly provider = 'legacy';

  async syncSeatingMap(venueId: string): Promise<SeatingMap> {
    console.log(`[Venue Plugin Manager] (legacy) Syncing seating map for venue ${venueId} via legacy XML feed`);
    return { venueId, provider: this.provider, sections: [] };
  }

  async getRealTimeAvailability(venueId: string): Promise<VenueAvailability> {
    console.log(`[Venue Plugin Manager] (legacy) Polling real-time availability for venue ${venueId}`);
    return { venueId, provider: this.provider, availableSeats: [], checkedAt: new Date() };
  }
}

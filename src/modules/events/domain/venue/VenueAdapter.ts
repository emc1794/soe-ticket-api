export interface SeatingSection {
  id: string;
  name: string;
  capacity: number;
}

export interface SeatingMap {
  venueId: string;
  provider: string;
  sections: SeatingSection[];
}

export interface VenueAvailability {
  venueId: string;
  provider: string;
  availableSeats: string[];
  checkedAt: Date;
}

export interface VenueAdapter {
  readonly provider: string;
  syncSeatingMap(venueId: string): Promise<SeatingMap>;
  getRealTimeAvailability(venueId: string): Promise<VenueAvailability>;
}

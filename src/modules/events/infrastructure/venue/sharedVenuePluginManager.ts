import { VenuePluginManager } from './VenuePluginManager';
import { GenericVenueAdapter } from './adapters/GenericVenueAdapter';
import { LegacyVenueAdapter } from './adapters/LegacyVenueAdapter';

export const venuePluginManager = new VenuePluginManager();
venuePluginManager.register(new GenericVenueAdapter());
venuePluginManager.register(new LegacyVenueAdapter());

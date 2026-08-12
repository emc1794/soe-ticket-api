import { VenueAdapter, SeatingMap, VenueAvailability } from '../../domain/venue/VenueAdapter';

export class VenuePluginManager {
  private readonly plugins = new Map<string, VenueAdapter>();

  constructor(private readonly defaultProvider: string = 'generic') {}

  register(plugin: VenueAdapter): void {
    this.plugins.set(plugin.provider, plugin);
  }

  listProviders(): string[] {
    return Array.from(this.plugins.keys());
  }

  syncSeatingMap(venueId: string, provider?: string): Promise<SeatingMap> {
    return this.resolve(provider).syncSeatingMap(venueId);
  }

  getRealTimeAvailability(venueId: string, provider?: string): Promise<VenueAvailability> {
    return this.resolve(provider).getRealTimeAvailability(venueId);
  }

  private resolve(provider?: string): VenueAdapter {
    const key = provider || this.defaultProvider;
    const plugin = this.plugins.get(key);
    if (!plugin) {
      throw new Error(`No venue adapter registered for provider "${key}"`);
    }
    return plugin;
  }
}

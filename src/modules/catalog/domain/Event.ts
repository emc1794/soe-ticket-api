export enum EventType {
  ASSIGNED = 'assigned',
  GENERAL = 'general',
}

export class Event {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly date: Date,
    public readonly venueId: string,
    public readonly artist: string,
    public readonly city: string,
    public readonly type: EventType = EventType.GENERAL,
    public readonly metadata: Record<string, any> = {}
  ) {}
}

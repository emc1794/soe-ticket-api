import { Event } from '../../domain/Event';
import { EventRepository } from '../../domain/EventRepository';
import { EventModel } from '../../../../shared/infrastructure/persistence/sequelize/EventModel';
import { VenueModel } from '../../../../shared/infrastructure/persistence/sequelize/VenueModel';
import {FindOptions, Op} from 'sequelize';

export class MySQLEventRepository implements EventRepository {
  async save(event: Event): Promise<void> {
    await EventModel.upsert({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      venueId: event.venueId,
      artist: event.artist,
      city: event.city,
      type: event.type,
      metadata: event.metadata,
    });
  }

  async findById(id: string): Promise<Event | null> {
    const model = await EventModel.findByPk(id);
    if (!model) return null;
    return this.toDomain(model);
  }

  async findAll(): Promise<Event[]> {
    const models = await EventModel.findAll();
    return models.map(this.toDomain);
  }

  async search(query: { 
    city?: string; 
    artist?: string; 
    venueName?: string; 
    dateRange?: { start: Date; end: Date } 
  }): Promise<Event[]> {
    const where: any = {};
    if (query.city) where.city = query.city;
    if (query.artist) where.artist = query.artist;
    
    if (query.dateRange) {
      where.date = {
        [Op.between]: [query.dateRange.start, query.dateRange.end],
      };
    }

    const include: any[] = [];
    if (query.venueName) {
      include.push({
        model: VenueModel,
        as: 'venue',
        where: {
          name: {
            [Op.like]: `%${query.venueName}%`,
          },
        },
      });
    }

    const options = {
      where,
      include: include.length > 0 ? include : undefined
    } as FindOptions<EventModel>

    const models = await EventModel.findAll(options);
    return models.map(this.toDomain);
  }

  private toDomain(model: EventModel): Event {
    return new Event(
      model.id,
      model.title,
      model.description,
      model.date,
      model.venueId,
      model.artist,
      model.city,
      model.type as any,
      model.metadata
    );
  }
}

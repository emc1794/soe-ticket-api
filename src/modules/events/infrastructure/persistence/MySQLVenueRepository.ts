import { Venue } from '../../domain/Venue';
import { VenueRepository } from '../../domain/VenueRepository';
import { VenueModel } from '../../../../shared/infrastructure/persistence/sequelize/VenueModel';

export class MySQLVenueRepository implements VenueRepository {
  async save(venue: Venue): Promise<void> {
    await VenueModel.upsert({
      id: venue.id,
      name: venue.name,
      address: venue.address,
      city: venue.city,
      capacity: venue.capacity,
    });
  }

  async findById(id: string): Promise<Venue | null> {
    const model = await VenueModel.findByPk(id);
    if (!model) return null;
    return this.toDomain(model);
  }

  private toDomain(model: VenueModel): Venue {
    return new Venue(
      model.id,
      model.name,
      model.address,
      model.city,
      model.capacity
    );
  }
}

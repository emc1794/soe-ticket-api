import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/mysql';
import { VenueModel } from './VenueModel';

export class EventModel extends Model {
  declare id: string;
  declare title: string;
  declare description: string;
  declare date: Date;
  declare venueId: string;
  declare artist: string;
  declare city: string;
  declare type: string;
  declare metadata: any;
  declare status: string;
}

EventModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    venueId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'venues',
        key: 'id',
      },
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('assigned', 'general'),
      defaultValue: 'general',
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {},
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'CANCELLED'),
      defaultValue: 'ACTIVE',
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: true,
  }
);

EventModel.belongsTo(VenueModel, { foreignKey: 'venueId', as: 'venue' });
VenueModel.hasMany(EventModel, { foreignKey: 'venueId', as: 'events' });

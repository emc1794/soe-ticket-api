import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/mysql';
import { VenueModel } from './VenueModel';

export class EventModel extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public date!: Date;
  public venueId!: string;
  public artist!: string;
  public city!: string;
  public type!: string;
  public metadata!: any;
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

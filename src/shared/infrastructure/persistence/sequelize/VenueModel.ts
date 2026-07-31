import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/mysql';

export class VenueModel extends Model {
  public id!: string;
  public name!: string;
  public address!: string;
  public city!: string;
  public capacity!: number;
}

VenueModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Venue',
    tableName: 'venues',
    timestamps: true,
  }
);

import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/mysql';
import { EventModel } from './EventModel';
import { UserModel } from './UserModel';

export class OrderModel extends Model {
  public id!: string;
  public userId!: string;
  public eventId!: string;
  public amount!: number;
  public status!: string;
  public seatNumbers!: string[];
  public appliedPromoCode!: string;
  public discountedAmount!: number;
}

OrderModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    eventId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seatNumbers: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    appliedPromoCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discountedAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
  }
);

OrderModel.belongsTo(EventModel, { foreignKey: 'eventId', as: 'event' });
EventModel.hasMany(OrderModel, { foreignKey: 'eventId', as: 'orders' });
OrderModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
UserModel.hasMany(OrderModel, { foreignKey: 'userId', as: 'orders' });

import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../database/mysql';
import { OrderModel } from './OrderModel';
import { EventModel } from './EventModel';
import { UserModel } from './UserModel';

export class TicketModel extends Model {
  declare id: string;
  declare orderId: string;
  declare eventId: string;
  declare userId: string;
  declare seatNumber?: string;
  declare qrCode?: string;
}

TicketModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'orders',
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
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    seatNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qrCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Ticket',
    tableName: 'tickets',
    timestamps: true,
  }
);

TicketModel.belongsTo(OrderModel, { foreignKey: 'orderId', as: 'order' });
OrderModel.hasMany(TicketModel, { foreignKey: 'orderId', as: 'tickets' });
TicketModel.belongsTo(EventModel, { foreignKey: 'eventId', as: 'event' });
EventModel.hasMany(TicketModel, { foreignKey: 'eventId', as: 'tickets' });
TicketModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
UserModel.hasMany(TicketModel, { foreignKey: 'userId', as: 'tickets' });

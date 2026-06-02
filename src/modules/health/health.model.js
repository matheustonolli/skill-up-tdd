import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Health = sequelize.define('Health', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'banned'),
    allowNull: false,
    defaultValue: 'active'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  loginCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'health',
  timestamps: true,
  underscored: true
});

export default Health;
import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Hashtag = sequelize.define('Hashtag', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  videoId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'hashtags',
  timestamps: true,
  underscored: true
});

export default Hashtag;
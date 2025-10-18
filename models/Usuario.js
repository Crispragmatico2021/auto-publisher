const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  timestamps: true // Crea createdAt y updatedAt automáticamente
});

module.exports = Usuario;

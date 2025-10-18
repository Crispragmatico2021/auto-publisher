const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'mi_app',                      // nombre de tu BD
  'mi_usuario',                  // tu usuario
  'mi_contraseña_segura', {      // tu contraseña
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: console.log,
});

// Probar conexión
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}

testConnection();

module.exports = sequelize;

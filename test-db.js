const { Sequelize, DataTypes } = require('sequelize'); 
const sequelize = new Sequelize('mi_app', 'u0_a339', '', { 
  host: 'localhost', 
  dialect: 'postgres', 
  port: 5432,
  logging: console.log 
}); 

const Publicacion = sequelize.define('Publicacion', {
  contenido: { type: DataTypes.TEXT, allowNull: false },
  programadaPara: { type: DataTypes.DATE, allowNull: false },
  estado: { type: DataTypes.STRING, defaultValue: 'pendiente' },
  plataforma: { type: DataTypes.STRING, defaultValue: 'facebook' }
}, {
  tableName: 'publicaciones',
  timestamps: true
});

async function testDatabase() {
  try {
    console.log('🔄 Conectando...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida');
    
    await sequelize.sync({ force: false });
    console.log('✅ Tabla sincronizada');
    
    const publicacion = await Publicacion.create({
      contenido: '¡Hola Facebook! Prueba desde PostgreSQL 🚀',
      programadaPara: new Date(Date.now() + 24 * 60 * 60 * 1000),
      estado: 'pendiente'
    });
    
    console.log('✅ Publicación creada ID:', publicacion.id);
    
    const publicaciones = await Publicacion.findAll();
    console.log('📋 Total de publicaciones:', publicaciones.length);
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDatabase();

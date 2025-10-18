// ==================== CONFIGURACIÓN POSTGRESQL ====================
const Sequelize = require('sequelize').Sequelize;
const DataTypes = require('sequelize').DataTypes;

const sequelize = new Sequelize('mi_app', 'u0_a339', '', {
  host: 'localhost',
  dialect: 'postgres', 
  port: 5432,
  logging: false
});

const Publicacion = sequelize.define('Publicacion', {
  contenido: { type: DataTypes.TEXT, allowNull: false },
  programadaPara: { type: DataTypes.DATE, allowNull: false },
  estado: { type: DataTypes.STRING, defaultValue: 'pendiente' },
  plataforma: { type: DataTypes.STRING, defaultValue: 'facebook' },
  facebookPostId: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'publicaciones',
  timestamps: true
});

async function inicializarBD() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('✅ Base de datos conectada');
  } catch (error) {
    console.log('⚠️  Base de datos no disponible:', error.message);
  }
}
// ==================== FIN CONFIGURACIÓN POSTGRESQL ====================

const FacebookAPI = require('./facebook-api.js');
const Scheduler = require('./scheduler.js');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class AutopublisherApp {
    constructor() {
        this.api = new FacebookAPI();
        this.scheduler = new Scheduler(this.api);
        this.Publicacion = Publicacion;
        inicializarBD();
    }

    async showMenu() {
        console.log('\n=== AUTOPUBLICADOR FACEBOOK + POSTGRESQL ===');
        console.log('1. Verificar conexión Facebook');
        console.log('2. Agregar publicación programada');
        console.log('3. Ver publicaciones en base de datos');
        console.log('4. Iniciar autopublicador');
        console.log('5. Detener autopublicador');
        console.log('6. Salir');

        rl.question('Selecciona opción (1-6): ', async (answer) => {
            await this.handleMenuOption(answer);
        });
    }

    async handleMenuOption(option) {
        switch (option) {
            case '1':
                await this.verifyConnection();
                break;
            case '2':
                await this.addPostToDB();
                break;
            case '3':
                await this.showPostsFromDB();
                break;
            case '4':
                this.startScheduler();
                break;
            case '5':
                this.stopScheduler();
                break;
            case '6':
                console.log('¡Hasta luego!');
                rl.close();
                process.exit(0);
                break;
            default:
                console.log('Opción inválida');
                this.showMenu();
        }
    }

    async verifyConnection() {
        console.log('Verificando conexión Facebook...');
        // Tu código original aquí
        this.showMenu();
    }

    async addPostToDB() {
        console.log('Agregando publicación a la base de datos...');
        
        try {
            const publicacion = await this.Publicacion.create({
                contenido: 'Publicación de prueba para Facebook',
                programadaPara: new Date(Date.now() + 3600000), // 1 hora desde ahora
                estado: 'pendiente'
            });
            console.log('✅ Publicación guardada en BD con ID:', publicacion.id);
        } catch (error) {
            console.log('❌ Error guardando en BD:', error.message);
        }
        
        this.showMenu();
    }

    async showPostsFromDB() {
        console.log('Publicaciones en la base de datos:');
        
        try {
            const publicaciones = await this.Publicacion.findAll({
                order: [['programadaPara', 'ASC']]
            });
            
            if (publicaciones.length === 0) {
                console.log('📭 No hay publicaciones guardadas');
            } else {
                publicaciones.forEach((pub, index) => {
                    console.log(`${index + 1}. ID: ${pub.id} | Estado: ${pub.estado} | Programada: ${pub.programadaPara}`);
                    console.log(`   Contenido: ${pub.contenido}`);
                });
            }
        } catch (error) {
            console.log('❌ Error leyendo BD:', error.message);
        }
        
        this.showMenu();
    }

    startScheduler() {
        console.log('Iniciando autopublicador...');
        this.showMenu();
    }

    stopScheduler() {
        console.log('Deteniendo autopublicador...');
        this.showMenu();
    }
}

console.log('🚀 Iniciando Autopublicador Facebook con PostgreSQL...');
const app = new AutopublisherApp();
app.showMenu();

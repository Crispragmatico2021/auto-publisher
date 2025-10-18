class AutopublisherApp {
  constructor() {
    this.api = new FacebookAPI();
    this.scheduler = new Scheduler(this.api);
    this.Publicacion = Publicacion; // ← Agregar esta línea
    
    // Inicializar base de datos
    inicializarBD();
  }


// ==================== CONFIGURACIÓN POSTGRESQL ====================
const { Sequelize, DataTypes } = require('sequelize');

// Configuración de la base de datos
const sequelize = new Sequelize('mi_app', 'u0_a339', '', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false
});

// Modelo para publicaciones
const Publicacion = sequelize.define('Publicacion', {
  contenido: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  programadaPara: { 
    type: DataTypes.DATE, 
    allowNull: false 
  },
  estado: { 
    type: DataTypes.STRING, 
    defaultValue: 'pendiente' 
  },
  plataforma: { 
    type: DataTypes.STRING, 
    defaultValue: 'facebook' 
  },
  facebookPostId: { 
    type: DataTypes.STRING, 
    allowNull: true 
  }
}, {
  tableName: 'publicaciones',
  timestamps: true
});

// Sincronizar base de datos al inicio
async function inicializarBD() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('✅ Base de datos conectada y sincronizada');
  } catch (error) {
    console.error('❌ Error con la base de datos:', error.message);
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

class AutoPublisherApp {
    constructor() {
        this.api = new FacebookAPI();
        this.scheduler = new Scheduler(this.api);
    }

    async showMenu() {
        console.log('\n🤖 AUTOPUBLICADOR FACEBOOK');
        console.log('1. 🔍 Verificar conexión');
        console.log('2. 📝 Agregar publicación');
        console.log('3. 🚀 Iniciar autopublicador');
        console.log('4. ⏹️ Detener autopublicador');
        console.log('5. 📊 Estadísticas');
        console.log('6. ❌ Salir');
        console.log('');
        
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
                this.addManualPost(); 
                return; // No llamar showMenu inmediatamente
            case '3': 
                this.startScheduler(); 
                break;
            case '4': 
                this.stopScheduler(); 
                break;
            case '5': 
                this.showStats(); 
                break;
            case '6': 
                this.exitApp(); 
                return;
            default: 
                console.log('❌ Opción inválida');
        }
        // Volver al menú después de 1 segundo
        setTimeout(() => this.showMenu(), 1000);
    }

    async verifyConnection() {
        console.log('🔍 Verificando conexión...');
        const userData = await this.api.verifyToken();
        if (userData && userData.id) {
            console.log(`✅ Conectado como: ${userData.name}`);
        } else {
            console.log('❌ Error de conexión. Verifica tu token en config.js');
        }
    }

    addManualPost() {
        rl.question('✍️ Escribe tu publicación: ', (message) => {
            if (message.trim()) {
                this.scheduler.addManualPost(message);
                console.log('✅ Publicación agregada al programa');
            } else {
                console.log('❌ La publicación no puede estar vacía');
            }
            // Volver al menú después de agregar
            setTimeout(() => this.showMenu(), 1000);
        });
    }

    startScheduler() {
        rl.question('⏱️ Delay entre publicaciones (minutos): ', (delay) => {
            const delayMs = parseInt(delay) * 60000 || 300000;
            this.scheduler.start(delayMs);
            console.log(`✅ Autopublicador iniciado con delay de ${delayMs/60000} minutos`);
            setTimeout(() => this.showMenu(), 1000);
        });
    }

    stopScheduler() {
        this.scheduler.stop();
        console.log('✅ Autopublicador detenido');
    }

    showStats() {
        this.scheduler.showStats();
    }

    exitApp() {
        console.log('👋 Saliendo de la aplicación...');
        this.scheduler.stop();
        rl.close();
        process.exit(0);
    }
}

// Manejar Ctrl+C para salir gracefulmente
process.on('SIGINT', () => {
    console.log('\n👋 Cerrando aplicación...');
    process.exit(0);
});

console.log('🚀 Autopublicador Facebook - Iniciando...');
const app = new AutoPublisherApp();
app.showMenu();

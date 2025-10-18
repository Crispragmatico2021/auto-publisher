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
    }

    async showMenu() {
        console.log('\n=== AUTOPUBLICADOR FACEBOOK ===');
        console.log('1. Verificar conexion');
        console.log('2. Agregar publicacion');
        console.log('3. Iniciar autopublicador');
        console.log('4. Detener autopublicador');
        console.log('5. Estadísticas');
        console.log('6. Salir');

        rl.question('Selecciona opcion (1-6): ', async (answer) => {
            await this.handleMenuOption(answer);
        });
    }

    async handleMenuOption(option) {
        switch (option) {
            case '1':
                await this.verifyConnection();
                break;
            case '2':
                await this.addManualPost();
                break;
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
        this.showMenu();
    }

    async addManualPost() {
        console.log('Agregar publicación manual...');
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

    showStats() {
        console.log('Mostrando estadísticas...');
        this.showMenu();
    }
}

// Iniciar aplicación
console.log('🚀 Iniciando Autopublicador Facebook...');
const app = new AutopublisherApp();
app.showMenu();

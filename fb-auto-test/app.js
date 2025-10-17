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
        console.log(`
🤖 AUTOPUBLICADOR FACEBOOK
1. 🔍 Verificar conexión
2. 📝 Agregar publicación
3. 🚀 Iniciar autopublicador
4. ⏹️ Detener autopublicador
5. 📊 Estadísticas
6. ❌ Salir
        `);
        rl.question('Selecciona opción (1-6): ', async (answer) => {
            await this.handleMenuOption(answer);
        });
    }

    async handleMenuOption(option) {
        switch (option) {
            case '1': await this.verifyConnection(); break;
            case '2': this.addManualPost(); break;
            case '3': this.startScheduler(); break;
            case '4': this.stopScheduler(); break;
            case '5': this.showStats(); break;
            case '6': this.exitApp(); return;
            default: console.log('❌ Opción inválida');
        }
        setTimeout(() => this.showMenu(), 1000);
    }

    async verifyConnection() {
        console.log('🔍 Verificando conexión...');
        const userData = await this.api.verifyToken();
        if (userData && userData.id) {
            console.log(`✅ Conectado como: ${userData.name}`);
        } else {
            console.log('❌ Error de conexión');
        }
    }

    addManualPost() {
        rl.question('✍️ Escribe tu publicación: ', (message) => {
            if (message.trim()) {
                this.scheduler.addManualPost(message);
            } else {
                console.log('❌ La publicación no puede estar vacía');
            }
        });
    }

    startScheduler() {
        rl.question('⏱️ Delay entre publicaciones (minutos): ', (delay) => {
            const delayMs = parseInt(delay) * 60000 || 300000;
            this.scheduler.start(delayMs);
        });
    }

    stopScheduler() {
        this.scheduler.stop();
    }

    showStats() {
        this.scheduler.showStats();
    }

    exitApp() {
        console.log('👋 Saliendo...');
        this.scheduler.stop();
        rl.close();
        process.exit(0);
    }
}

console.log('🚀 Autopublicador Facebook - Iniciando...');
const app = new AutoPublisherApp();
app.showMenu();

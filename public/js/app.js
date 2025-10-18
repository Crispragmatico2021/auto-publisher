class AutoPublisherDashboard {
    constructor() {
        this.updateInterval = null;
        this.init();
    }

    init() {
        this.startAutoUpdate();
        this.addLog('Dashboard inicializado correctamente');
    }

    async verifyConnection() {
        this.addLog('Verificando conexión con Facebook...');
        
        try {
            const response = await fetch('/api/verify-connection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('connectionStatus').className = 'status connected';
                document.getElementById('connectionStatus').textContent = '✅ Conectado';
                document.getElementById('userInfo').textContent = `Usuario: ${data.user}`;
                this.addLog(`✅ Conectado como: ${data.user}`);
            } else {
                document.getElementById('connectionStatus').className = 'status disconnected';
                document.getElementById('connectionStatus').textContent = '❌ Error de conexión';
                document.getElementById('userInfo').textContent = '';
                this.addLog(`❌ Error de conexión: ${data.error}`);
            }
        } catch (error) {
            this.addLog(`❌ Error verificando conexión: ${error.message}`);
        }
    }

    async startScheduler() {
        const delay = document.getElementById('delayInput').value;
        this.addLog(`Iniciando scheduler con intervalo de ${delay} minutos...`);
        
        try {
            const response = await fetch('/api/start-scheduler', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delay: parseInt(delay) })
            });
            
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('schedulerStatus').className = 'status running';
                document.getElementById('schedulerStatus').textContent = '🟢 Ejecutándose';
                this.addLog(`✅ ${data.message}`);
            } else {
                this.addLog(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            this.addLog(`❌ Error iniciando scheduler: ${error.message}`);
        }
    }

    async stopScheduler() {
        this.addLog('Deteniendo scheduler...');
        
        try {
            const response = await fetch('/api/stop-scheduler', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('schedulerStatus').className = 'status stopped';
                document.getElementById('schedulerStatus').textContent = '⏹️ Detenido';
                this.addLog(`✅ ${data.message}`);
            }
        } catch (error) {
            this.addLog(`❌ Error deteniendo scheduler: ${error.message}`);
        }
    }

    async addPost() {
        const message = document.getElementById('postMessage').value.trim();
        
        if (!message) {
            alert('Por favor escribe un mensaje');
            return;
        }
        
        this.addLog(`Agregando publicación: ${message.substring(0, 50)}...`);
        
        try {
            const response = await fetch('/api/add-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('postMessage').value = '';
                this.addLog('✅ Publicación agregada correctamente');
                this.refreshStats();
            } else {
                this.addLog(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            this.addLog(`❌ Error agregando publicación: ${error.message}`);
        }
    }

    async refreshStats() {
        try {
            const response = await fetch('/api/stats');
            const stats = await response.json();
            
            document.getElementById('totalPosts').textContent = stats.totalPosts;
            document.getElementById('successfulPosts').textContent = stats.successfulPosts;
            document.getElementById('failedPosts').textContent = stats.failedPosts;
        } catch (error) {
            console.error('Error actualizando estadísticas:', error);
        }
    }

    async updateStatus() {
        try {
            const response = await fetch('/api/status');
            const status = await response.json();
            
            // Actualizar estado de conexión
            if (status.connection.status === 'connected') {
                document.getElementById('connectionStatus').className = 'status connected';
                document.getElementById('connectionStatus').textContent = '✅ Conectado';
                document.getElementById('userInfo').textContent = `Usuario: ${status.connection.user}`;
            } else {
                document.getElementById('connectionStatus').className = 'status disconnected';
                document.getElementById('connectionStatus').textContent = '🔴 Desconectado';
            }
            
            // Actualizar estado del scheduler
            if (status.isRunning) {
                document.getElementById('schedulerStatus').className = 'status running';
                document.getElementById('schedulerStatus').textContent = '🟢 Ejecutándose';
            } else {
                document.getElementById('schedulerStatus').className = 'status stopped';
                document.getElementById('schedulerStatus').textContent = '⏹️ Detenido';
            }
            
            // Actualizar estadísticas
            this.refreshStats();
            
        } catch (error) {
            console.error('Error actualizando estado:', error);
        }
    }

    startAutoUpdate() {
        this.updateInterval = setInterval(() => {
            this.updateStatus();
        }, 2000); // Actualizar cada 2 segundos
    }

    addLog(message) {
        const logs = document.getElementById('logs');
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        logs.appendChild(logEntry);
        logs.scrollTop = logs.scrollHeight;
        
        // Mantener máximo 50 logs
        while (logs.children.length > 50) {
            logs.removeChild(logs.firstChild);
        }
    }
}

// Funciones globales para los botones
function verifyConnection() { window.dashboard.verifyConnection(); }
function startScheduler() { window.dashboard.startScheduler(); }
function stopScheduler() { window.dashboard.stopScheduler(); }
function addPost() { window.dashboard.addPost(); }
function refreshStats() { window.dashboard.refreshStats(); }

// Inicializar dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new AutoPublisherDashboard();
});

    // En la clase AutoPublisherDashboard, agregar:

    async addPost() {
        const message = document.getElementById('postMessage').value.trim();
        const imageUrl = document.getElementById('imageUrl').value.trim();
        const linkUrl = document.getElementById('linkUrl').value.trim();
        const videoUrl = document.getElementById('videoUrl').value.trim();
        
        if (!message) {
            alert('Por favor escribe un mensaje');
            return;
        }
        
        this.addLog(`Agregando publicación: ${message.substring(0, 50)}...`);
        
        try {
            const response = await fetch('/api/add-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message,
                    imageUrl: imageUrl || null,
                    linkUrl: linkUrl || null,
                    videoUrl: videoUrl || null
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Limpiar formularios
                document.getElementById('postMessage').value = '';
                document.getElementById('imageUrl').value = '';
                document.getElementById('linkUrl').value = '';
                document.getElementById('videoUrl').value = '';
                
                this.addLog(`✅ ${data.message}`);
                this.refreshStats();
            } else {
                this.addLog(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            this.addLog(`❌ Error agregando publicación: ${error.message}`);
        }
    }

    async refreshStats() {
        try {
            const response = await fetch('/api/stats');
            const stats = await response.json();
            
            document.getElementById('totalPosts').textContent = stats.totalPosts;
            document.getElementById('successfulPosts').textContent = stats.successfulPosts;
            document.getElementById('failedPosts').textContent = stats.failedPosts;
            
            // Actualizar estadísticas por tipo
            document.getElementById('textPosts').textContent = stats.byType.text;
            document.getElementById('imagePosts').textContent = stats.byType.image;
            document.getElementById('linkPosts').textContent = stats.byType.link;
            document.getElementById('videoPosts').textContent = stats.byType.video;
            
        } catch (error) {
            console.error('Error actualizando estadísticas:', error);
        }
    }

    async updateStatus() {
        try {
            const response = await fetch('/api/status');
            const status = await response.json();
            
            // Actualizar estado de conexión
            if (status.connection.status === 'connected') {
                document.getElementById('connectionStatus').className = 'status connected';
                document.getElementById('connectionStatus').textContent = '✅ Conectado';
                document.getElementById('userInfo').textContent = `Usuario: ${status.connection.user}`;
            } else {
                document.getElementById('connectionStatus').className = 'status disconnected';
                document.getElementById('connectionStatus').textContent = '🔴 Desconectado';
            }
            
            // Actualizar estado del scheduler
            if (status.isRunning) {
                document.getElementById('schedulerStatus').className = 'status running';
                document.getElementById('schedulerStatus').textContent = '🟢 Ejecutándose';
            } else {
                document.getElementById('schedulerStatus').className = 'status stopped';
                document.getElementById('schedulerStatus').textContent = '⏹️ Detenido';
            }
            
            // Actualizar estadísticas
            this.refreshStats();
            
            // Actualizar estadísticas del calendario
            if (window.dashboard.updateCalendarStats) {
                window.dashboard.updateCalendarStats(status.calendarStats);
            }
            
        } catch (error) {
            console.error('Error actualizando estado:', error);
        }
    }

const express = require('express');
const path = require('path');
const FacebookAPI = require('./facebook-api.js');
const Scheduler = require('./scheduler.js');
const ContentManager = require('./content-manager.js');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Instanciar las clases
const api = new FacebookAPI();
const scheduler = new Scheduler(api);
const contentManager = new ContentManager();

// Estado de la aplicación
let appStatus = {
    isRunning: false,
    lastPost: null,
    stats: { totalPosts: 0, usedPosts: 0, availablePosts: 0 }
};

// Rutas de la API
app.get('/api/status', (req, res) => {
    res.json({
        status: appStatus.isRunning ? 'running' : 'stopped',
        stats: contentManager.getStats(),
        lastPost: appStatus.lastPost
    });
});

app.post('/api/start', (req, res) => {
    const delay = (req.body.delay || 5) * 60000; // minutos a milisegundos
    scheduler.start(delay);
    appStatus.isRunning = true;
    res.json({ success: true, message: 'Autopublicador iniciado' });
});

app.post('/api/stop', (req, res) => {
    scheduler.stop();
    appStatus.isRunning = false;
    res.json({ success: true, message: 'Autopublicador detenido' });
});

app.post('/api/add-post', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ success: false, message: 'El mensaje es requerido' });
    }
    contentManager.addPost(message);
    res.json({ success: true, message: 'Publicación agregada' });
});

app.get('/api/verify-connection', async (req, res) => {
    try {
        const userData = await api.verifyToken();
        res.json({ 
            success: true, 
            user: userData 
        });
    } catch (error) {
        res.json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor web ejecutándose en: http://localhost:${port}`);
    console.log(`📱 Para acceso desde otros dispositivos: http://TU-IP-LOCAL:${port}`);
});

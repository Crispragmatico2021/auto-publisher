const express = require('express');
const path = require('path');
const FacebookAPI = require('./facebook-api.js');
const Scheduler = require('./scheduler.js');
const CalendarScheduler = require('./calendar-scheduler.js');
const ContentManager = require('./content-manager.js');
const AuthSystem = require('./auth-system.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Inicializar sistemas
const authSystem = new AuthSystem();
const contentManager = new ContentManager();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(authSystem.getMiddleware());

// Usar rutas de autenticación
app.use('/auth', authSystem.getRoutes());

// Instancias (se inicializarán después de la autenticación)
let api = null;
let scheduler = null;
let calendar = null;

// Estado de la aplicación
let appState = {
  isRunning: false,
  lastPost: null,
  stats: { 
    totalPosts: 0, 
    successfulPosts: 0, 
    failedPosts: 0,
    byType: { text: 0, image: 0, link: 0, video: 0 }
  },
  connection: { status: 'disconnected', user: null },
  calendarStats: {
    total: 0,
    upcoming: 0,
    completed: 0,
    failed: 0
  }
};

// Función para inicializar sistemas después de autenticación
function initializeUserSystems(user) {
  api = new FacebookAPI(user.accessToken);
  scheduler = new Scheduler(api);
  calendar = new CalendarScheduler(api, contentManager);
  
  // Actualizar estado de conexión
  appState.connection = { 
    status: 'connected', 
    user: user.name,
    userId: user.id
  };
}

// Middleware para verificar autenticación en rutas protegidas
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    // Inicializar sistemas si es necesario
    if (!api) {
      initializeUserSystems(req.user);
    }
    return next();
  }
  res.redirect('/login');
}

// Rutas públicas
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

// Ruta para login con token manual
app.post('/auth/token', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.json({ success: false, error: 'Token requerido' });
  }

  try {
    const tempApi = new FacebookAPI(token);
    const verification = await tempApi.verifyToken();
    
    if (verification.valid) {
      // Crear usuario temporal
      const user = {
        id: verification.user.id,
        name: verification.user.name,
        email: '',
        photo: '',
        accessToken: token,
        refreshToken: null,
        groups: [],
        createdAt: new Date()
      };
      
      // Iniciar sesión manualmente
      req.login(user, (err) => {
        if (err) {
          return res.json({ success: false, error: 'Error iniciando sesión' });
        }
        initializeUserSystems(user);
        res.json({ success: true });
      });
    } else {
      res.json({ success: false, error: 'Token inválido' });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Rutas protegidas
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/status', requireAuth, (req, res) => {
  // Actualizar estadísticas del calendario
  if (calendar) {
    appState.calendarStats = calendar.getCalendarStats();
  }
  res.json(appState);
});

app.post('/api/verify-connection', requireAuth, async (req, res) => {
  try {
    const verification = await api.verifyToken();
    
    if (verification.valid) {
      appState.connection = { 
        status: 'connected', 
        user: verification.user.name 
      };
      res.json({ success: true, user: verification.user.name });
    } else {
      appState.connection = { status: 'disconnected', user: null };
      res.json({ success: false, error: verification.error.message });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.post('/api/start-scheduler', requireAuth, (req, res) => {
  const delay = (req.body.delay || 5) * 60000;
  scheduler.start(delay);
  appState.isRunning = true;
  res.json({ success: true, message: `Scheduler iniciado (${req.body.delay} min)` });
});

app.post('/api/stop-scheduler', requireAuth, (req, res) => {
  scheduler.stop();
  appState.isRunning = false;
  res.json({ success: true, message: 'Scheduler detenido' });
});

app.post('/api/add-post', requireAuth, (req, res) => {
  const { message, imageUrl, link, videoUrl } = req.body;
  
  if (message && message.trim()) {
    scheduler.addManualPost(message.trim(), imageUrl, link, videoUrl);
    appState.stats.totalPosts++;
    
    // Actualizar estadísticas por tipo
    const type = detectContentType(imageUrl, link, videoUrl);
    appState.stats.byType[type]++;
    
    res.json({ 
      success: true, 
      message: `${type.toUpperCase()} agregado`,
      type: type
    });
  } else {
    res.json({ success: false, error: 'Mensaje vacío' });
  }
});

app.post('/api/schedule-post', requireAuth, (req, res) => {
  const { message, imageUrl, link, videoUrl, scheduleDate, scheduleTime, groups } = req.body;
  
  if (!message || !message.trim()) {
    return res.json({ success: false, error: 'Mensaje vacío' });
  }

  if (!scheduleDate || !scheduleTime) {
    return res.json({ success: false, error: 'Fecha y hora requeridas' });
  }

  try {
    // Combinar fecha y hora
    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    
    if (scheduledDateTime <= new Date()) {
      return res.json({ success: false, error: 'La fecha debe ser futura' });
    }

    const postData = {
      message: message.trim(),
      imageUrl: imageUrl || null,
      link: link || null,
      videoUrl: videoUrl || null
    };

    const targetGroups = groups && groups.length > 0 ? groups : [];
    
    const scheduledPost = calendar.schedulePost(postData, scheduledDateTime, targetGroups);
    
    res.json({ 
      success: true, 
      message: 'Publicación programada exitosamente',
      postId: scheduledPost.id,
      scheduledDate: scheduledPost.scheduleDate
    });
    
  } catch (error) {
    res.json({ success: false, error: 'Error programando publicación: ' + error.message });
  }
});

app.get('/api/scheduled-posts', requireAuth, (req, res) => {
  const filter = req.query.filter || 'all';
  const posts = calendar.getScheduledPosts(filter);
  res.json(posts);
});

app.get('/api/calendar-stats', requireAuth, (req, res) => {
  const stats = calendar.getCalendarStats();
  res.json(stats);
});

app.delete('/api/scheduled-post/:id', requireAuth, (req, res) => {
  const postId = parseInt(req.params.id);
  
  if (calendar.cancelScheduledPost(postId)) {
    res.json({ success: true, message: 'Publicación cancelada' });
  } else {
    res.json({ success: false, error: 'Publicación no encontrada' });
  }
});

app.get('/api/calendar-events', requireAuth, (req, res) => {
  const { date } = req.query;
  
  if (!date) {
    return res.json({ success: false, error: 'Fecha requerida' });
  }
  
  const events = calendar.getPostsForDate(date);
  res.json(events);
});

app.get('/api/stats', requireAuth, (req, res) => {
  res.json(appState.stats);
});

// Ruta para obtener grupos del usuario
app.get('/api/user-groups', requireAuth, async (req, res) => {
  try {
    const groups = await api.getGroups();
    res.json(groups);
  } catch (error) {
    res.json({ success: false, error: error.message, groups: [] });
  }
});

// Función auxiliar para detectar tipo de contenido
function detectContentType(imageUrl, link, videoUrl) {
  if (videoUrl) return 'video';
  if (imageUrl) return 'image';
  if (link) return 'link';
  return 'text';
}

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 AutoPublisher ejecutándose en: http://localhost:${port}`);
  console.log(`🔐 Sistema de autenticación activado`);
  console.log(`📅 Calendario de publicaciones listo`);
  console.log(`📱 Accesible desde tu red local`);
});

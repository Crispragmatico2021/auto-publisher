const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// PostgreSQL para Railway (usa variable de entorno)
const databaseUrl = process.env.DATABASE_URL;
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.DATABASE_URL ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

// Modelo de Publicaciones
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

// Rutas
app.get('/', async (req, res) => {
  try {
    const publicaciones = await Publicacion.findAll({
      order: [['program
mkdir views
mkdir public
cat > views/index.ejs << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .nav {
            background: #34495e;
            padding: 15px;
            display: flex;
            justify-content: center;
            gap: 20px;
        }
        .nav a {
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 25px;
            transition: background 0.3s;
        }
        .nav a:hover {
            background: #2c3e50;
        }
        .content {
            padding: 30px;
        }
        .card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 5px solid #667eea;
        }
        .publicacion {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            justify-content: between;
            align-items: center;
        }
        .publicacion.pendiente { border-left: 5px solid #ffc107; }
        .publicacion.publicada { border-left: 5px solid #28a745; }
        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-group input, .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .alert {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .alert.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .alert.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📱 <%= title %></h1>
            <p>Gestión visual de publicaciones programadas</p>
        </div>
        
        <div class="nav">
            <a href="/">🏠 Inicio</a>
            <a href="/estadisticas">📊 Estadísticas</a>
        </div>
        
        <div class="content">
            <% if (typeof success !== 'undefined') { %>
                <div class="alert success">
                    ✅ <%= success %>
                </div>
            <% } %>
            
            <% if (typeof error !== 'undefined') { %>
                <div class="alert error">
                    ❌ <%= error %>
                </div>
            <% } %>
            
            <div class="card">
                <h2>➕ Agregar Nueva Publicación</h2>
                <form action="/agregar-publicacion" method="POST">
                    <div class="form-group">
                        <label for="contenido">Contenido:</label>
                        <textarea name="contenido" id="contenido" rows="3" placeholder="Escribe tu publicación para Facebook..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="fecha">Fecha:</label>
                        <input type="date" name="fecha" id="fecha" required>
                    </div>
                    <div class="form-group">
                        <label for="hora">Hora:</label>
                        <input type="time" name="hora" id="hora" required>
                    </div>
                    <button type="submit" class="btn">💾 Guardar Publicación</button>
                </form>
            </div>
            
            <div class="card">
                <h2>📋 Publicaciones Programadas (<%= publicaciones.length %>)</h2>
                <% if (publicaciones.length === 0) { %>
                    <p>No hay publicaciones programadas.</p>
                <% } else { %>
                    <% publicaciones.forEach(publicacion => { %>
                        <div class="publicacion <%= publicacion.estado %>">
                            <div style="flex: 1;">
                                <strong><%= publicacion.contenido %></strong><br>
                                <small>🕐 Programada: <%= publicacion.programadaPara.toLocaleString() %></small><br>
                                <small>📊 Estado: <strong><%= publicacion.estado %></strong></small>
                            </div>
                            <div>
                                <span class="badge"><%= publicacion.id %></span>
                            </div>
                        </div>
                    <% }); %>
                <% } %>
            </div>
        </div>
    </div>
</body>
</html>

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views-landing'));
app.use(express.static('public-landing'));

// Datos de tu producto
const productInfo = {
  name: "Auto-Publisher Facebook",
  description: "Sistema automático de publicaciones programadas para Facebook",
  price: "$49.99",
  features: [
    "Publicaciones programadas automáticas",
    "Interfaz web intuitiva", 
    "Base de datos PostgreSQL",
    "Soporte para múltiples cuentas",
    "Estadísticas en tiempo real"
  ]
};

// Rutas
app.get('/', (req, res) => {
  res.render('index', {
    product: productInfo,
    title: 'Auto-Publisher - Publicaciones Automáticas para Facebook'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Landing page ejecutándose en puerto ${PORT}`);
});

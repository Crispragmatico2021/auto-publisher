const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views-payments'));
app.use(express.static('public-payments'));
app.use(express.urlencoded({ extended: true }));

// Base de datos
const databaseUrl = process.env.DATABASE_URL;
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.DATABASE_URL ? { require: true, rejectUnauthorized: false } : false
  }
});

// Modelos
const User = sequelize.define('User', {
  ip: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  demoUsed: { type: DataTypes.BOOLEAN, defaultValue: false },
  demoExpires: { type: DataTypes.DATE },
  purchased: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const Payment = sequelize.define('Payment', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  method: { type: DataTypes.STRING, allowNull: false }, // credit_card, debit_card
  cardType: { type: DataTypes.STRING }, // visa, mastercard, etc.
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  ip: { type: DataTypes.STRING, allowNull: false }
});

// Configuración
const PRODUCT_PRICE = 49.99;
const DEMO_DAYS = 3;

// Middleware de seguridad
function checkIPLimit(req, res, next) {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  User.findOne({ where: { ip: clientIP } })
    .then(user => {
      if (user && user.demoUsed && !user.purchased) {
        return res.render('blocked', { 
          title: 'Acceso Bloqueado',
          message: 'Ya has usado tu demo gratuita. Por favor realiza la compra.'
        });
      }
      req.clientIP = clientIP;
      next();
    })
    .catch(error => next(error));
}

// Detectar tipo de tarjeta
function detectCardType(cardNumber) {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
  return 'unknown';
}

// Simular procesamiento de pago
async function processPayment(paymentData) {
  // En producción, aquí integrarías con Stripe/PayPal
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simular éxito en el 95% de los casos
      const success = Math.random() > 0.05;
      resolve({
        success: success,
        transactionId: 'TX_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        message: success ? 'Pago procesado exitosamente' : 'Error en el procesamiento del pago'
      });
    }, 2000);
  });
}

// Rutas
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Auto-Publisher Pro - Demo Gratuita',
    price: PRODUCT_PRICE,
    demoDays: DEMO_DAYS
  });
});

app.get('/demo', checkIPLimit, async (req, res) => {
  try {
    const clientIP = req.clientIP;
    
    let user = await User.findOne({ where: { ip: clientIP } });
    
    if (!user) {
      user = await User.create({
        ip: clientIP,
        email: `demo-${Date.now()}@autopublisher.com`,
        demoExpires: new Date(Date.now() + DEMO_DAYS * 24 * 60 * 60 * 1000)
      });
    } else if (!user.demoUsed) {
      user.demoUsed = true;
      user.demoExpires = new Date(Date.now() + DEMO_DAYS * 24 * 60 * 60 * 1000);
      await user.save();
    }

    res.render('demo', {
      title: 'Demo Auto-Publisher',
      user: user,
      expiresIn: DEMO_DAYS
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

app.get('/comprar', checkIPLimit, async (req, res) => {
  const clientIP = req.clientIP;
  const user = await User.findOne({ where: { ip: clientIP } });
  
  res.render('checkout', {
    title: 'Comprar Auto-Publisher',
    price: PRODUCT_PRICE,
    user: user,
    clientIP: clientIP
  });
});

app.post('/procesar-pago', checkIPLimit, async (req, res) => {
  try {
    const { cardNumber, expiry, cvv, email, paymentMethod } = req.body;
    const clientIP = req.clientIP;
    
    // Validaciones
    if (!cardNumber || !expiry || !cvv || !paymentMethod) {
      return res.render('error', { error: 'Todos los campos son requeridos' });
    }

    const user = await User.findOne({ where: { ip: clientIP } });
    const cardType = detectCardType(cardNumber);
    
    // Procesar pago
    const paymentResult = await processPayment({
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiry,
      cvv,
      amount: PRODUCT_PRICE,
      method: paymentMethod,
      cardType: cardType
    });

    if (!paymentResult.success) {
      return res.render('error', { 
        error: 'Error en el pago: ' + paymentResult.message 
      });
    }

    // Crear registro de pago
    const payment = await Payment.create({
      userId: user.id,
      amount: PRODUCT_PRICE,
      method: paymentMethod,
      cardType: cardType,
      ip: clientIP,
      status: 'completed'
    });

    // Activar usuario
    user.purchased = true;
    user.email = email;
    await user.save();

    res.render('success', {
      title: '¡Pago Exitoso!',
      payment: payment,
      user: user,
      transactionId: paymentResult.transactionId
    });
  } catch (error) {
    res.render('error', { error: 'Error procesando el pago: ' + error.message });
  }
});

// Inicializar servidor
async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('✅ Base de datos conectada');
    
    app.listen(PORT, () => {
      console.log(`🚀 Sistema de pagos ejecutándose en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error.message);
  }
}

startServer();

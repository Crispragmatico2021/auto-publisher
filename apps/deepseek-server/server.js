const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3000;

// 🔑 CONFIGURACIÓN DEEPSEEK - REEMPLAZA CON TU API KEY
const DEEPSEEK_API_KEY = 'sk-58e15***********************3072'; // ← Tu API key aquí
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: '🚀 SERVIDOR DEEPSEEK ACTIVO', 
    server: 'Termux Mobile',
    uptime: Math.floor(process.uptime() / 60) + ' minutos',
    timestamp: new Date().toLocaleString()
  });
});

// API DeepSeek
app.post('/api/chat', async (req, res) => {
  try {
    const { message, model = 'deepseek-chat' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Se requiere un mensaje' });
    }

    console.log('📥 Mensaje recibido:', message.substring(0, 100));

    const response = await axios.post(DEEPSEEK_API_URL, {
      model: model,
      messages: [{ role: 'user', content: message }],
      max_tokens: 4000,
      temperature: 0.7,
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    const aiResponse = response.data.choices[0].message.content;
    
    console.log('🤖 Respuesta generada');
    
    res.json({
      success: true,
      response: aiResponse,
      tokens: response.data.usage,
      model: response.data.model
    });

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      error: error.response?.data?.error?.message || error.message
    });
  }
});

// Procesamiento por lotes
app.post('/api/batch', async (req, res) => {
  try {
    const { messages } = req.body;
    
    const results = [];
    for (const msg of messages) {
      try {
        const response = await axios.post(DEEPSEEK_API_URL, {
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: msg }],
          max_tokens: 2000
        }, {
          headers: {
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        results.push({
          input: msg,
          output: response.data.choices[0].message.content,
          success: true
        });
      } catch (error) {
        results.push({
          input: msg,
          error: error.message,
          success: false
        });
      }
    }

    res.json({ results });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 DeepSeek Server activo: http://localhost:${PORT}`);
  console.log(`⏰ Iniciado: ${new Date().toLocaleString()}`);
  console.log(`📡 Acceso local: http://192.168.1.X:${PORT}`);
  console.log(`🔑 API Key configurada: ${DEEPSEEK_API_KEY ? '✅' : '❌'}`);
});

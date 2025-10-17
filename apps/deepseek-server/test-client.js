// Cliente de prueba para DeepSeek
const axios = require('axios');

const API_URL = 'http://localhost:3000/api/chat';

async function testDeepSeek() {
  try {
    console.log('🧪 Probando DeepSeek...');
    
    const response = await axios.post(API_URL, {
      message: 'Hola! Responde con un saludo corto confirmando que el servidor funciona correctamente.'
    });

    console.log('✅ Respuesta recibida:');
    console.log('🤖:', response.data.response);
    console.log('📊 Tokens usados:', response.data.tokens);
    
  } catch (error) {
    console.error('❌ Error en prueba:', error.response?.data || error.message);
  }
}

// Ejecutar prueba
testDeepSeek();

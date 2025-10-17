const fs = require('fs');
const path = require('path');

console.log('=== CONFIGURACIÓN COMPLETA FACEBOOK AUTO PUBLISHER ===\n');

// Verificar si existe config.json
const configPath = path.join(__dirname, 'config.json');
if (!fs.existsSync(configPath)) {
    console.log('❌ Archivo config.json no encontrado');
    console.log('📝 Creando archivo de configuración básico...');
    
    const configTemplate = {
        "accessToken": "TU_TOKEN_DE_ACCESO_AQUI",
        "pageId": "TU_PAGE_ID_AQUI",
        "groups": [],
        "schedule": {
            "enabled": true,
            "interval": 60
        }
    };
    
    fs.writeFileSync(configPath, JSON.stringify(configTemplate, null, 2));
    console.log('✅ config.json creado. Por favor edita el archivo con tus datos.');
} else {
    console.log('✅ config.json encontrado');
}

console.log('\n📋 Pasos para configurar:');
console.log('1. Ejecuta: node obtener-grupos.js');
console.log('2. Ejecuta: node configurar-grupos.js');
console.log('3. Ejecuta: node verificar-todo.js');
console.log('4. Ejecuta: node app.js para iniciar\n');

console.log('¿Quieres ejecutar el verificador ahora? (y/n)');

// Esperar entrada del usuario
process.stdin.once('data', (data) => {
    const input = data.toString().trim().toLowerCase();
    if (input === 'y' || input === 'yes') {
        console.log('\nEjecutando verificación...');
        try {
            require('./verificar-todo.js');
        } catch (error) {
            console.log('❌ Error en verificación:', error.message);
        }
    } else {
        console.log('✅ Configuración lista. Recuerda editar config.json con tus datos.');
    }
    process.stdin.pause();
});

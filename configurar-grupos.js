const fs = require('fs');
const FacebookAPI = require('./facebook-api.js');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function configurarGrupos() {
    console.log('🎯 CONFIGURACIÓN DE GRUPOS AUTOMÁTICA\n');
    
    const api = new FacebookAPI();
    
    // Verificar token
    console.log('🔍 Verificando tu token...');
    const user = await api.verifyToken();
    if (!user) {
        console.log('❌ Token inválido. Verifica tu accessToken en config.js');
        rl.close();
        return;
    }
    
    console.log('✅ Token válido - Conectado como:', user.name);
    
    // Obtener grupos
    console.log('\n📡 Obteniendo tus grupos...');
    const groups = await api.getGroups();
    
    if (groups.length === 0) {
        console.log('❌ No tienes grupos disponibles para publicar');
        console.log('💡 Asegúrate de ser administro o miembro activo de los grupos');
        rl.close();
        return;
    }
    
    // Mostrar grupos
    console.log('\n🎯 TUS GRUPOS:');
    groups.forEach((group, index) => {
        console.log(`${index + 1}. ${group.name}`);
        console.log(   `   ID: ${group.id} | Miembros: ${group.member_count || 'N/A'}`);
    });
    
    // Seleccionar grupos
    rl.question('\n📝 Ingresa los números de los grupos a usar (ej: 1,3,5 o * para todos): ', (respuesta) => {
        let selectedGroups = [];
        
        if (respuesta.trim() === '*') {
            // Todos los grupos
            selectedGroups = groups.map(g => g.id);
        } else {
            // Grupos seleccionados
            const indices = respuesta.split(',').map(num => parseInt(num.trim()) - 1);
            selectedGroups = indices.map(index => groups[index]?.id).filter(id => id);
        }
        
        if (selectedGroups.length === 0) {
            console.log('❌ No seleccionaste grupos válidos');
            rl.close();
            return;
        }
        
        // Actualizar config.js
        const configPath = './config.js';
        let configContent = fs.readFileSync(configPath, 'utf8');
        
        // Reemplazar el array de grupos
        const nuevoGrupos = `groups: ${JSON.stringify(selectedGroups, null, 4)}`;
        configContent = configContent.replace(/groups: \[[\s\S]*?\]/, nuevoGrupos);
        
        fs.writeFileSync(configPath, configContent);
        
        console.log('\n✅ CONFIGURACIÓN COMPLETADA!');
        console.log('📁 Grupos configurados:', selectedGroups.length);
        console.log('🎯 IDs:', selectedGroups);
        console.log('\n🚀 Ahora ejecuta: node app.js');
        
        rl.close();
    });
}

configurarGrupos();

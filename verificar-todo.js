const FacebookAPI = require('./facebook-api.js');
const api = new FacebookAPI();

async function verificarTodo() {
    console.log('🔍 VERIFICACIÓN COMPLETA DEL SISTEMA\n');
    
    // 1. Verificar token
    console.log('1. 🔑 Verificando token...');
    const user = await api.verifyToken();
    if (!user) {
        console.log('   ❌ Token inválido');
        return;
    }
    console.log('   ✅ Token válido - Usuario:', user.name);
    
    // 2. Verificar grupos configurados
    console.log('\n2. 📁 Verificando grupos...');
    const config = require('./config.js');
    console.log('   ✅ Grupos configurados:', config.groups.length);
    
    // 3. Verificar permisos y grupos accesibles
    console.log('\n3. 🔒 Verificando permisos...');
    const groups = await api.getGroups();
    const gruposConPermisos = groups.filter(g => config.groups.includes(g.id));
    console.log('   ✅ Grupos con acceso:', gruposConPermisos.length);
    
    // Mostrar detalles de grupos
    console.log('\n📋 DETALLES DE GRUPOS:');
    groups.forEach((group, index) => {
        const estaConfigurado = config.groups.includes(group.id);
        console.log(`   ${index + 1}. ${group.name}`);
        console.log(`      🆔 ID: ${group.id}`);
        console.log(`      ✅ Configurado: ${estaConfigurado ? 'SÍ' : 'NO'}`);
        console.log(`      👥 Miembros: ${group.member_count || 'N/A'}`);
        console.log('');
    });
    
    // 4. Resumen
    console.log('🎯 RESUMEN:');
    console.log('   👤 Usuario:', user.name);
    console.log('   📁 Grupos configurados:', config.groups.length);
    console.log('   🔗 Grupos accesibles:', gruposConPermisos.length);
    
    if (gruposConPermisos.length > 0) {
        console.log('\n🚀 ¡TODO LISTO! Ejecuta: node app.js');
        
        // Probar publicación rápida
        console.log('\n🧪 Probando publicación rápida...');
        const primerGrupo = gruposConPermisos[0];
        const resultado = await api.postToGroup(primerGrupo.id, '🚀 Prueba del AutoPublisher - Esta es una prueba. Puedes borrarla.');
        
        if (resultado.success) {
            console.log('✅ ¡PUBLICACIÓN EXITOSA!');
            console.log('📝 Post ID:', resultado.postId);
        } else {
            console.log('❌ Error en prueba:', resultado.error?.message);
        }
    } else {
        console.log('\n❌ Revisa la configuración de grupos');
        console.log('💡 Ejecuta: node configurar-grupos.js');
    }
}

verificarTodo().catch(console.error);

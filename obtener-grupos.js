const FacebookAPI = require('./facebook-api.js');
const api = new FacebookAPI();

async function obtenerGrupos() {
    console.log('🔍 Obteniendo tus grupos...\n');
    
    // Primero configura un token temporal
    if (api.accessToken === "EAALtqR9N4WwBPr6os8Kb2HVo9vLN2NHBxWks1CuxtQsav4E1qC9aE0oFBS4ZCF0lwZBvOb8GEZChduRZAjkD1zhe2XnZAUW9ZBgoPhbbheKJTyMDtiPPgzzlli036nK4pTohpLhcYhx01uTmCQOXFHWSCZCElILnJ8S5ZBEWBppAZCJtvjrLJKoI9IoFYEQ8ZBR8gNu7a1BioCMZCZAoS2UmPiruulxRFfU7ZBEK9DAZDZD") {
        console.log('❌ Primero configura tu token en config.js');
        console.log('💡 Ejecuta: node configurar-todo.js');
        return;
    }
    
    const user = await api.verifyToken();
    if (!user) {
        console.log('❌ Token inválido');
        return;
    }
    
    console.log('✅ Conectado como:', user.name, '\n');
    
    const groups = await api.getGroups();
    
    if (groups.length === 0) {
        console.log('❌ No tienes grupos disponibles');
        return;
    }
    
    console.log('🎯 TUS GRUPOS DISPONIBLES:');
    console.log('='.repeat(50));
    
    groups.forEach((group, index) => {
        console.log(`${index + 1}. ${group.name}`);
        console.log(`   🆔 ID: ${group.id}`);
        console.log(`   👥 Miembros: ${group.member_count || 'N/A'}`);
        console.log('');
    });
    
    console.log('💡 Copia los IDs que quieras usar');
}

obtenerGrupos();

// config.js - Configuración de Facebook Auto Publisher

module.exports = {
    // Token de acceso de Facebook
    // Obtén uno desde: https://developers.facebook.com/tools/explorer/
    accessToken: process.env.FB_ACCESS_TOKEN || 'EAALtqR9N4WwBPhXs83FZAcu5DDkApKjjmqQd8xZBc4Kf68PrWyerZBUE28fmZAI8lLvz6dDvJzZCrYN8fL57PQvNqRsp3r8JwLOZAdRHsceKvS0FdXau2VPjviL6BGQZCd3MGwWZCmSLuPsGTq08zDe20UZBWbfqWZCiTttHJpZBt0o8i6kEmWZCUzKIUcb0x5y23ioLgoBMlLoIV9ZCZCGbYlYMdCoEO1jy4r08wM',
    
    // ID de tu página de Facebook (opcional)
    pageId: process.env.FB_PAGE_ID || 'https://www.facebook.com/share/1LK1DkpEma/',
    
    // Configuración de grupos
    groups: [
        // Ejemplo:
        // { id: '123456789', name: 'Nombre del Grupo 1', enabled: true },
        // { id: '987654321', name: 'Nombre del Grupo 2', enabled: true }
    ],
    
    // Configuración del programador
    schedule: {
        enabled: true,
        interval: 60, // minutos entre publicaciones
        maxPostsPerDay: 5
    },
    
    // Configuración de la API de Facebook
    facebook: {
        version: 'v18.0',
        baseUrl: 'https://graph.facebook.com'
    },
    
    // Configuración de contenido
    content: {
        defaultMessage: '¡Hola a todos! 👋',
        imagePaths: [
            './images/image1.jpg',
            './images/image2.jpg',
            './images/image3.jpg'
        ]
    }
};

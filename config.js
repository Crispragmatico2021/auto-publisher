module.exports = {
    // REEMPLAZA ESTO CON TU TOKEN REAL
    accessToken: " EAAQSAWAe7qsBPukOTZAQKOdmlaLOuRViGNsSxI1vJt9fQlMDaZCy3KBxxRyasO8SMLegJyavMhZBkSVxjWH59soM7GZBC0iKxcIZAlopWAKWLtB4xL4lZBCThC7SKVPAo2caYPUTnw2dK7CfzNJTHilBUHBIjDkhwpKmXHhr2FKNswLQmfOvqd2lFntMB5FOZAhRI1ZC4XZCR1iUXLCIYktdKf6zC11EwRDSBeUmJ",
    
    // Configuración de la API
    apiVersion: "v18.0",
    apiBaseUrl: "https://graph.facebook.com",
    
    // Configuración de publicaciones
    defaultDelay: 300000, // 5 minutos entre publicaciones
    maxPostsPerHour: 40,
    
    // Grupos donde publicar (agrega los IDs de tus grupos)
    groups: [
        "ID_DEL_GRUPO_1", // Reemplaza con ID de grupo real
        "ID_DEL_GRUPO_2"  // Reemplaza con ID de grupo real
    ]
};

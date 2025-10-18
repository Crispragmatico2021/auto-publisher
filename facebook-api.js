const fetch = require('node-fetch');
const config = require('./config.js');
const FormData = require('form-data');
const fs = require('fs');

class FacebookAPI {
    constructor(accessToken = null) {
        // Usar token proporcionado o el de configuración
        this.accessToken = accessToken || process.env.FACEBOOK_ACCESS_TOKEN || config.accessToken;
        this.baseUrl = `${config.apiBaseUrl}/${config.apiVersion}`;
    }

    // Establecer token dinámicamente
    setAccessToken(token) {
        this.accessToken = token;
    }

    async verifyToken(token = null) {
        const useToken = token || this.accessToken;
        
        try {
            const response = await fetch(
                `${this.baseUrl}/me?access_token=${useToken}`
            );
            const data = await response.json();
            
            if (data.error) {
                return { 
                    valid: false, 
                    error: data.error,
                    user: null 
                };
            }
            
            return { 
                valid: true, 
                user: data,
                token: useToken 
            };
        } catch (error) {
            console.error('Error verificando token:', error);
            return { 
                valid: false, 
                error: error.message,
                user: null 
            };
        }
    }

    async getGroups(token = null) {
        const useToken = token || this.accessToken;
        
        try {
            const response = await fetch(
                `${this.baseUrl}/me/groups?access_token=${useToken}&fields=id,name,privacy,member_count`
            );
            const data = await response.json();
            
            if (data.error) {
                return { success: false, error: data.error, groups: [] };
            }
            
            return { 
                success: true, 
                groups: data.data || [] 
            };
        } catch (error) {
            console.error('Error obteniendo grupos:', error);
            return { success: false, error: error.message, groups: [] };
        }
    }

    async getPages(token = null) {
        const useToken = token || this.accessToken;
        
        try {
            const response = await fetch(
                `${this.baseUrl}/me/accounts?access_token=${useToken}`
            );
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error obteniendo páginas:', error);
            return [];
        }
    }

    // Publicar texto simple
    async postToGroup(groupId, message, token = null) {
        const useToken = token || this.accessToken;
        
        try {
            const response = await fetch(
                `${this.baseUrl}/${groupId}/feed`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        access_token: useToken
                    })
                }
            );
            const data = await response.json();
            
            if (data.id) {
                console.log(`✅ Publicado en grupo ${groupId}: ${data.id}`);
                return { success: true, postId: data.id };
            } else {
                console.log(`❌ Error: ${data.error.message}`);
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error publicando:', error);
            return { success: false, error: error.message };
        }
    }

    // Publicar con imagen por URL
    async postWithImage(groupId, message, imageUrl, token = null) {
        const useToken = token || this.accessToken;
        
        try {
            const response = await fetch(
                `${this.baseUrl}/${groupId}/photos`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        url: imageUrl,
                        access_token: useToken
                    })
                }
            );
            const data = await response.json();
            
            if (data.id) {
                console.log(`✅ Imagen publicada en grupo ${groupId}: ${data.id}`);
                return { success: true, postId: data.id };
            } else {
                console.log(`❌ Error con imagen: ${data.error.message}`);
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error publicando imagen:', error);
            return { success: false, error: error.message };
        }
    }

    // Publicar con enlace
    async postWithLink(groupId, message, link, token = null) {
        const useToken = token || this.accessToken;
        
        try {
            const response = await fetch(
                `${this.baseUrl}/${groupId}/feed`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        link: link,
                        access_token: useToken
                    })
                }
            );
            const data = await response.json();
            
            if (data.id) {
                console.log(`✅ Enlace publicado en grupo ${groupId}: ${data.id}`);
                return { success: true, postId: data.id };
            } else {
                console.log(`❌ Error con enlace: ${data.error.message}`);
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error publicando enlace:', error);
            return { success: false, error: error.message };
        }
    }

    // Publicación inteligente (detecta automáticamente el tipo)
    async smartPost(groupId, content, token = null) {
        const useToken = token || this.accessToken;
        
        // Detectar tipo de contenido
        if (content.imageUrl) {
            return await this.postWithImage(groupId, content.message, content.imageUrl, useToken);
        } else if (content.link) {
            return await this.postWithLink(groupId, content.message, content.link, useToken);
        } else {
            return await this.postToGroup(groupId, content.message, useToken);
        }
    }

    // Subir video
    async postVideo(groupId, message, videoUrl, token = null) {
        const useToken = token || this.accessToken;
        
        try {
            const response = await fetch(
                `${this.baseUrl}/${groupId}/videos`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        description: message,
                        file_url: videoUrl,
                        access_token: useToken
                    })
                }
            );
            const data = await response.json();
            
            if (data.id) {
                console.log(`✅ Video publicado en grupo ${groupId}: ${data.id}`);
                return { success: true, postId: data.id };
            } else {
                console.log(`❌ Error con video: ${data.error.message}`);
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error publicando video:', error);
            return { success: false, error: error.message };
        }
    }

    // Verificar permisos del token
    async checkPermissions(token = null) {
        const useToken = token || this.accessToken;
        
        try {
            const response = await fetch(
                `${this.baseUrl}/me/permissions?access_token=${useToken}`
            );
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error verificando permisos:', error);
            return [];
        }
    }

    // Refrescar token (implementación básica)
    async refreshToken(refreshToken) {
        // En una implementación real, aquí refrescarías el token
        // Por ahora retornamos el mismo token
        return refreshToken;
    }
}

module.exports = FacebookAPI;

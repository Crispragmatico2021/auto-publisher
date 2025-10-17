const fetch = require('node-fetch');
const config = require('./config.js');

class FacebookAPI {
    constructor() {
        this.accessToken = config.accessToken;
        this.baseUrl = `${config.apiBaseUrl}/${config.apiVersion}`;
    }

    async verifyToken() {
        try {
            const response = await fetch(
                `${this.baseUrl}/me?access_token=${this.accessToken}`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error verificando token:', error);
            return null;
        }
    }

    async getGroups() {
        try {
            const response = await fetch(
                `${this.baseUrl}/me/groups?access_token=${this.accessToken}`
            );
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error obteniendo grupos:', error);
            return [];
        }
    }

    async postToGroup(groupId, message) {
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
                        access_token: this.accessToken
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

    async postWithImage(groupId, message, imageUrl) {
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
                        access_token: this.accessToken
                    })
                }
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error publicando imagen:', error);
            return null;
        }
    }
}

module.exports = FacebookAPI;

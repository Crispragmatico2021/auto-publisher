class ContentManager {
    constructor() {
        this.posts = [];
        this.currentIndex = 0;
        this.loadSamplePosts();
    }

    addPost(message, imageUrl = null, link = null, videoUrl = null) {
        const post = {
            id: Date.now(),
            message: message,
            imageUrl: imageUrl,
            link: link,
            videoUrl: videoUrl,
            type: this.detectContentType(imageUrl, link, videoUrl),
            used: false,
            timestamp: new Date().toISOString()
        };
        this.posts.push(post);
        return post;
    }

    detectContentType(imageUrl, link, videoUrl) {
        if (videoUrl) return 'video';
        if (imageUrl) return 'image';
        if (link) return 'link';
        return 'text';
    }

    getNextPost() {
        if (this.posts.length === 0) {
            this.loadSamplePosts();
        }

        // Buscar publicación no usada
        const availablePosts = this.posts.filter(post => !post.used);
        if (availablePosts.length === 0) {
            // Reiniciar todas las publicaciones
            this.posts.forEach(post => post.used = false);
            return this.posts[0];
        }

        // Seleccionar aleatoriamente
        const randomIndex = Math.floor(Math.random() * availablePosts.length);
        return availablePosts[randomIndex];
    }

    loadSamplePosts() {
        // Publicaciones de ejemplo con multimedia
        this.posts = [
            {
                id: 1,
                message: "¡Hola a todos! Espero que tengan un excelente día 🚀",
                type: "text",
                used: false,
                timestamp: new Date().toISOString()
            },
            {
                id: 2,
                message: "Miren esta increíble imagen de tecnología",
                imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500",
                type: "image",
                used: false,
                timestamp: new Date().toISOString()
            },
            {
                id: 3,
                message: "Artículo interesante sobre desarrollo web",
                link: "https://developer.mozilla.org/es/",
                type: "link",
                used: false,
                timestamp: new Date().toISOString()
            },
            {
                id: 4,
                message: "Video tutorial de programación",
                videoUrl: "https://example.com/video.mp4", // Reemplaza con URL real
                type: "video",
                used: false,
                timestamp: new Date().toISOString()
            }
        ];
    }

    getStats() {
        const totalPosts = this.posts.length;
        const availablePosts = this.posts.filter(post => !post.used).length;
        const usedPosts = totalPosts - availablePosts;
        
        // Estadísticas por tipo
        const typeStats = {
            text: this.posts.filter(post => post.type === 'text').length,
            image: this.posts.filter(post => post.type === 'image').length,
            link: this.posts.filter(post => post.type === 'link').length,
            video: this.posts.filter(post => post.type === 'video').length
        };

        return {
            totalPosts,
            availablePosts,
            usedPosts,
            typeStats
        };
    }

    // Método para agregar múltiples publicaciones
    addPosts(postsArray) {
        postsArray.forEach(post => {
            this.addPost(post.message, post.imageUrl, post.link, post.videoUrl);
        });
    }

    // Limpiar publicaciones usadas
    clearUsedPosts() {
        this.posts = this.posts.filter(post => !post.used);
    }

    // Exportar publicaciones para backup
    exportPosts() {
        return JSON.stringify(this.posts, null, 2);
    }

    // Importar publicaciones desde JSON
    importPosts(jsonData) {
        try {
            const importedPosts = JSON.parse(jsonData);
            this.posts = importedPosts;
            return true;
        } catch (error) {
            console.error('Error importando publicaciones:', error);
            return false;
        }
    }
}

module.exports = ContentManager;

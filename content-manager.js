class ContentManager {
    constructor() {
        this.posts = [];
        this.currentIndex = 0;
    }

    addPost(message, imageUrl = null) {
        this.posts.push({
            id: this.posts.length + 1,
            message: message,
            imageUrl: imageUrl,
            used: false,
            timestamp: new Date()
        });
    }

    getNextPost() {
        if (this.posts.length === 0) return null;
        const post = this.posts[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.posts.length;
        return post;
    }

    loadSamplePosts() {
        const samplePosts = [
            "¡Hola grupo! Espero que tengan un excelente día 🚀",
            "Compartiendo contenido interesante con la comunidad 📱",
            "¿Alguien tiene preguntas sobre el tema del grupo? 👥",
            "Nuevo contenido disponible para todos los miembros 🎯"
        ];

        samplePosts.forEach(post => {
            this.addPost(post);
        });
    }

    getStats() {
        return {
            totalPosts: this.posts.length,
            usedPosts: this.posts.filter(p => p.used).length,
            availablePosts: this.posts.filter(p => !p.used).length
        };
    }
}

// Asegúrate de que esta línea esté al final
module.exports = ContentManager;

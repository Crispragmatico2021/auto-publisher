const ContentManager = require('./content-manager.js');

class Scheduler {
    constructor(facebookAPI) {
        this.api = facebookAPI;
        this.contentManager = new ContentManager();
        this.isRunning = false;
        this.currentTimer = null;
        this.stats = {
            totalPosts: 0,
            successfulPosts: 0,
            failedPosts: 0,
            lastPost: null
        };
    }

    start(delay = 300000) {
        if (this.isRunning) {
            console.log("⚠️ El programador ya está en ejecución");
            return;
        }
        this.isRunning = true;
        console.log(`🚀 Iniciando autopublicador (delay: ${delay/1000}s)`);
        this.scheduleNextPost(delay);
    }

    stop() {
        this.isRunning = false;
        if (this.currentTimer) clearTimeout(this.currentTimer);
        console.log("⏹️ Autopublicador detenido");
    }

    scheduleNextPost(delay) {
        if (!this.isRunning) return;
        this.currentTimer = setTimeout(async () => {
            await this.makePost();
            this.scheduleNextPost(delay);
        }, delay);
    }

    async makePost() {
        try {
            const post = this.contentManager.getNextPost();
            if (!post) {
                console.log("📭 No hay publicaciones disponibles");
                return;
            }

            const groups = require('./config.js').groups;
            if (groups.length === 0) {
                console.log("❌ No hay grupos configurados");
                return;
            }

            const randomGroup = groups[Math.floor(Math.random() * groups.length)];
            
            console.log(`📤 Publicando ${post.type} en grupo ${randomGroup}...`);
            
            let result;
            switch (post.type) {
                case 'image':
                    result = await this.api.postWithImage(randomGroup, post.message, post.imageUrl);
                    break;
                case 'link':
                    result = await this.api.postWithLink(randomGroup, post.message, post.link);
                    break;
                case 'video':
                    result = await this.api.postVideo(randomGroup, post.message, post.videoUrl);
                    break;
                default:
                    result = await this.api.postToGroup(randomGroup, post.message);
            }

            if (result.success) {
                post.used = true;
                this.stats.successfulPosts++;
                this.stats.lastPost = {
                    type: post.type,
                    group: randomGroup,
                    timestamp: new Date().toISOString(),
                    message: post.message.substring(0, 50) + '...'
                };
                console.log(`✅ ${post.type.toUpperCase()} publicado exitosamente`);
            } else {
                this.stats.failedPosts++;
                console.log(`❌ Error publicando ${post.type}: ${result.error.message}`);
            }
            
            this.stats.totalPosts++;

        } catch (error) {
            console.error('❌ Error en publicación programada:', error);
            this.stats.failedPosts++;
        }
    }

    addManualPost(message, imageUrl = null, link = null, videoUrl = null) {
        this.contentManager.addPost(message, imageUrl, link, videoUrl);
        const type = this.contentManager.detectContentType(imageUrl, link, videoUrl);
        console.log(`📝 ${type.toUpperCase()} agregado: ${message.substring(0, 50)}...`);
    }

    loadSampleContent() {
        this.contentManager.loadSamplePosts();
        console.log("📚 Publicaciones de ejemplo cargadas");
    }

    showStats() {
        const contentStats = this.contentManager.getStats();
        console.log(`📊 Publicaciones: ${contentStats.totalPosts} total, ${contentStats.availablePosts} disponibles`);
        console.log(`📈 Rendimiento: ${this.stats.successfulPosts} exitosas, ${this.stats.failedPosts} fallidas`);
        console.log(`🎯 Tipos: Texto(${contentStats.typeStats.text}) Imagen(${contentStats.typeStats.image}) Enlace(${contentStats.typeStats.link}) Video(${contentStats.typeStats.video})`);
        
        if (this.stats.lastPost) {
            console.log(`🕒 Última publicación: ${this.stats.lastPost.type} a las ${new Date(this.stats.lastPost.timestamp).toLocaleTimeString()}`);
        }
    }

    // Nuevo método para agregar contenido en lote
    addBatchPosts(postsArray) {
        this.contentManager.addPosts(postsArray);
        console.log(`📦 Lote de ${postsArray.length} publicaciones agregado`);
    }

    // Método para limpiar publicaciones usadas
    clearUsedPosts() {
        this.contentManager.clearUsedPosts();
        console.log("🗑️ Publicaciones usadas eliminadas");
    }
}

module.exports = Scheduler;

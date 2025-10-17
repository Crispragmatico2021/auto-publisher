const ContentManager = require('./content-manager.js');

class Scheduler {
    constructor(facebookAPI) {
        this.api = facebookAPI;
        this.contentManager = new ContentManager();
        this.isRunning = false;
        this.currentTimer = null;
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
            console.log(`📤 Publicando en grupo ${randomGroup}...`);
            const result = await this.api.postToGroup(randomGroup, post.message);
            if (result.success) post.used = true;
        } catch (error) {
            console.error('❌ Error en publicación programada:', error);
        }
    }

    addManualPost(message, imageUrl = null) {
        this.contentManager.addPost(message, imageUrl);
        console.log(`📝 Publicación agregada: ${message.substring(0, 50)}...`);
    }

    loadSampleContent() {
        this.contentManager.loadSamplePosts();
        console.log("📚 Publicaciones de ejemplo cargadas");
    }

    showStats() {
        const stats = this.contentManager.getStats();
        console.log(`📊 Publicaciones: ${stats.totalPosts} total, ${stats.availablePosts} disponibles`);
    }
}

module.exports = Scheduler;

class CalendarScheduler {
    constructor(facebookAPI, contentManager) {
        this.api = facebookAPI;
        this.contentManager = contentManager;
        this.scheduledPosts = [];
        this.timers = new Map();
        this.loadScheduledPosts();
    }

    // Programar publicación para fecha/hora específica
    schedulePost(postData, scheduleDate, groups = null) {
        const scheduledPost = {
            id: Date.now() + Math.random(),
            postData: postData,
            scheduleDate: new Date(scheduleDate),
            groups: groups || require('./config.js').groups,
            status: 'scheduled', // scheduled, publishing, completed, failed
            createdAt: new Date(),
            result: null
        };

        this.scheduledPosts.push(scheduledPost);
        this.setupTimer(scheduledPost);
        this.saveScheduledPosts();
        
        return scheduledPost;
    }

    // Configurar timer para publicación programada
    setupTimer(scheduledPost) {
        const now = new Date();
        const scheduleTime = new Date(scheduledPost.scheduleDate).getTime();
        const delay = scheduleTime - now.getTime();

        if (delay <= 0) {
            this.executeScheduledPost(scheduledPost);
            return;
        }

        const timer = setTimeout(() => {
            this.executeScheduledPost(scheduledPost);
        }, delay);

        this.timers.set(scheduledPost.id, timer);
    }

    // Ejecutar publicación programada
    async executeScheduledPost(scheduledPost) {
        try {
            scheduledPost.status = 'publishing';
            this.saveScheduledPosts();

            console.log(`📅 Ejecutando publicación programada: ${scheduledPost.postData.message.substring(0, 50)}...`);

            let result;
            const targetGroups = scheduledPost.groups.length > 0 ? scheduledPost.groups : require('./config.js').groups;

            for (const groupId of targetGroups) {
                result = await this.api.smartPost(groupId, scheduledPost.postData);
                
                if (result.success) {
                    console.log(`✅ Publicación programada exitosa en grupo ${groupId}`);
                } else {
                    console.log(`❌ Error en grupo ${groupId}: ${result.error.message}`);
                    break;
                }
            }

            scheduledPost.status = result.success ? 'completed' : 'failed';
            scheduledPost.result = result;
            scheduledPost.completedAt = new Date();
            this.saveScheduledPosts();

            // Eliminar timer
            this.timers.delete(scheduledPost.id);

        } catch (error) {
            console.error('❌ Error ejecutando publicación programada:', error);
            scheduledPost.status = 'failed';
            scheduledPost.result = { error: error.message };
            this.saveScheduledPosts();
        }
    }

    // Obtener publicaciones programadas
    getScheduledPosts(filter = 'all') {
        const now = new Date();
        
        switch (filter) {
            case 'upcoming':
                return this.scheduledPosts.filter(post => 
                    new Date(post.scheduleDate) > now && post.status === 'scheduled'
                ).sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate));
            
            case 'completed':
                return this.scheduledPosts.filter(post => post.status === 'completed')
                    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
            
            case 'failed':
                return this.scheduledPosts.filter(post => post.status === 'failed');
            
            default:
                return this.scheduledPosts.sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate));
        }
    }

    // Cancelar publicación programada
    cancelScheduledPost(postId) {
        const postIndex = this.scheduledPosts.findIndex(post => post.id === postId);
        
        if (postIndex !== -1) {
            const post = this.scheduledPosts[postIndex];
            
            // Cancelar timer si existe
            if (this.timers.has(postId)) {
                clearTimeout(this.timers.get(postId));
                this.timers.delete(postId);
            }
            
            post.status = 'cancelled';
            post.cancelledAt = new Date();
            this.saveScheduledPosts();
            
            return true;
        }
        
        return false;
    }

    // Editar publicación programada
    editScheduledPost(postId, updates) {
        const post = this.scheduledPosts.find(p => p.id === postId);
        
        if (post && post.status === 'scheduled') {
            // Cancelar timer actual
            if (this.timers.has(postId)) {
                clearTimeout(this.timers.get(postId));
                this.timers.delete(postId);
            }
            
            // Aplicar updates
            Object.assign(post, updates);
            
            // Reprogramar
            this.setupTimer(post);
            this.saveScheduledPosts();
            
            return true;
        }
        
        return false;
    }

    // Cargar publicaciones programadas desde almacenamiento
    loadScheduledPosts() {
        try {
            // En una implementación real, esto cargaría desde una base de datos
            // Por ahora usamos un array en memoria
            this.scheduledPosts = [];
            
            // Reprogramar timers para publicaciones futuras
            this.scheduledPosts.forEach(post => {
                if (post.status === 'scheduled' && new Date(post.scheduleDate) > new Date()) {
                    this.setupTimer(post);
                }
            });
        } catch (error) {
            console.error('Error cargando publicaciones programadas:', error);
            this.scheduledPosts = [];
        }
    }

    // Guardar publicaciones programadas
    saveScheduledPosts() {
        try {
            // En una implementación real, esto guardaría en una base de datos
            // Por ahora solo mantenemos en memoria
        } catch (error) {
            console.error('Error guardando publicaciones programadas:', error);
        }
    }

    // Estadísticas del calendario
    getCalendarStats() {
        const now = new Date();
        const upcoming = this.scheduledPosts.filter(post => 
            new Date(post.scheduleDate) > now && post.status === 'scheduled'
        ).length;
        
        const completed = this.scheduledPosts.filter(post => 
            post.status === 'completed'
        ).length;
        
        const failed = this.scheduledPosts.filter(post => 
            post.status === 'failed'
        ).length;

        return {
            total: this.scheduledPosts.length,
            upcoming,
            completed,
            failed,
            cancelled: this.scheduledPosts.filter(post => post.status === 'cancelled').length
        };
    }

    // Obtener publicaciones para una fecha específica
    getPostsForDate(date) {
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        return this.scheduledPosts.filter(post => {
            const postDate = new Date(post.scheduleDate);
            return postDate >= targetDate && postDate < nextDay;
        });
    }
}

module.exports = CalendarScheduler;

// Funcionalidades del calendario
class CalendarManager {
    constructor() {
        this.scheduledPosts = [];
        this.initCalendar();
    }

    initCalendar() {
        // Establecer fecha mínima como hoy
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('scheduleDate').min = today;
        
        // Establecer hora por defecto (próxima hora)
        const nextHour = new Date();
        nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
        document.getElementById('scheduleTime').value = nextHour.toTimeString().slice(0, 5);
        
        // Cargar publicaciones programadas
        this.loadScheduledPosts('upcoming');
    }

    async schedulePost() {
        const message = document.getElementById('scheduleMessage').value.trim();
        const imageUrl = document.getElementById('scheduleImageUrl').value.trim();
        const linkUrl = document.getElementById('scheduleLinkUrl').value.trim();
        const videoUrl = document.getElementById('scheduleVideoUrl').value.trim();
        const scheduleDate = document.getElementById('scheduleDate').value;
        const scheduleTime = document.getElementById('scheduleTime').value;

        if (!message) {
            alert('Por favor escribe un mensaje');
            return;
        }

        if (!scheduleDate || !scheduleTime) {
            alert('Por favor selecciona fecha y hora');
            return;
        }

        const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
        if (scheduledDateTime <= new Date()) {
            alert('La fecha y hora deben ser futuras');
            return;
        }

        try {
            const response = await fetch('/api/schedule-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    imageUrl: imageUrl || null,
                    linkUrl: linkUrl || null,
                    videoUrl: videoUrl || null,
                    scheduleDate,
                    scheduleTime
                })
            });

            const data = await response.json();

            if (data.success) {
                window.dashboard.addLog(`📅 Publicación programada para ${scheduledDateTime.toLocaleString()}`);
                
                // Limpiar formulario
                document.getElementById('scheduleMessage').value = '';
                document.getElementById('scheduleImageUrl').value = '';
                document.getElementById('scheduleLinkUrl').value = '';
                document.getElementById('scheduleVideoUrl').value = '';
                
                // Recargar lista
                this.loadScheduledPosts('upcoming');
                
                // Mostrar confirmación
                alert('✅ Publicación programada exitosamente');
            } else {
                window.dashboard.addLog(`❌ Error programando: ${data.error}`);
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            window.dashboard.addLog(`❌ Error programando publicación: ${error.message}`);
            alert('Error al programar la publicación');
        }
    }

    async loadScheduledPosts(filter = 'upcoming') {
        try {
            const response = await fetch(`/api/scheduled-posts?filter=${filter}`);
            this.scheduledPosts = await response.json();
            this.renderScheduledPosts();
        } catch (error) {
            console.error('Error cargando publicaciones programadas:', error);
            window.dashboard.addLog('❌ Error cargando publicaciones programadas');
        }
    }

    renderScheduledPosts() {
        const container = document.getElementById('scheduledPostsList');
        
        if (this.scheduledPosts.length === 0) {
            container.innerHTML = '<div class="no-posts">No hay publicaciones programadas</div>';
            return;
        }

        container.innerHTML = this.scheduledPosts.map(post => `
            <div class="scheduled-post fade-in">
                <div class="scheduled-post-header">
                    <div class="scheduled-post-message">
                        ${this.escapeHtml(post.postData.message.substring(0, 100))}${post.postData.message.length > 100 ? '...' : ''}
                    </div>
                    <div class="scheduled-post-type type-${post.postData.type || 'text'}">
                        ${(post.postData.type || 'text').toUpperCase()}
                    </div>
                </div>
                
                <div class="scheduled-post-details">
                    <div><strong>📅 Programada:</strong> ${new Date(post.scheduleDate).toLocaleString()}</div>
                    <div><strong>📊 Estado:</strong> <span class="scheduled-post-status status-${post.status}">${this.getStatusText(post.status)}</span></div>
                    ${post.completedAt ? `<div><strong>✅ Completada:</strong> ${new Date(post.completedAt).toLocaleString()}</div>` : ''}
                    ${post.postData.imageUrl ? `<div><strong>🖼️ Imagen:</strong> ${post.postData.imageUrl.substring(0, 30)}...</div>` : ''}
                    ${post.postData.link ? `<div><strong>🔗 Enlace:</strong> ${post.postData.link.substring(0, 30)}...</div>` : ''}
                    ${post.postData.videoUrl ? `<div><strong>🎬 Video:</strong> ${post.postData.videoUrl.substring(0, 30)}...</div>` : ''}
                </div>
                
                ${post.status === 'scheduled' ? `
                    <div class="scheduled-post-actions">
                        <button onclick="calendar.cancelScheduledPost(${post.id})" class="btn-danger">
                            ❌ Cancelar
                        </button>
                    </div>
                ` : ''}
                
                ${post.status === 'failed' && post.result ? `
                    <div style="margin-top: 10px; padding: 10px; background: #f8d7da; border-radius: 5px; font-size: 12px;">
                        <strong>Error:</strong> ${post.result.error?.message || 'Error desconocido'}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    getStatusText(status) {
        const statusMap = {
            'scheduled': '📅 Programada',
            'publishing': '🔄 Publicando',
            'completed': '✅ Completada',
            'failed': '❌ Fallida',
            'cancelled': '🚫 Cancelada'
        };
        return statusMap[status] || status;
    }

    async cancelScheduledPost(postId) {
        if (!confirm('¿Estás seguro de que quieres cancelar esta publicación?')) {
            return;
        }

        try {
            const response = await fetch(`/api/scheduled-post/${postId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                window.dashboard.addLog('✅ Publicación programada cancelada');
                this.loadScheduledPosts('upcoming');
            } else {
                window.dashboard.addLog(`❌ Error cancelando publicación: ${data.error}`);
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            window.dashboard.addLog(`❌ Error cancelando publicación: ${error.message}`);
            alert('Error al cancelar la publicación');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Actualizar estadísticas del calendario
    updateCalendarStats(stats) {
        document.getElementById('upcomingPosts').textContent = stats.upcoming;
        document.getElementById('completedPosts').textContent = stats.completed;
    }
}

// Inicializar calendario
const calendar = new CalendarManager();

// Funciones globales
function schedulePost() { calendar.schedulePost(); }
function loadScheduledPosts(filter) { calendar.loadScheduledPosts(filter); }

// Integrar con el dashboard principal
window.dashboard.updateCalendarStats = function(stats) {
    calendar.updateCalendarStats(stats);
};

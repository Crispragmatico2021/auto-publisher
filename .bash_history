# Dentro de Debian - limpiar instalación pesada
apt remove --purge -y openbox tint2 pcmanfm
apt autoremove -y
apt install -y     xorg     i3-wm     rofi     thunar     thunar-archive-plugin     firefox-esr     geany     lxterminal     htop     feh     picom     nitrogen     tigervnc-standalone-server
apt install -y     git curl wget vim     python3 python3-pip     nodejs npm     build-essential
mkdir -p ~/.config/i3
cat > ~/.config/i3/config << 'EOF'
# i3 config - MAX PERFORMANCE
font pango:DejaVu Sans Mono 9

# Mod key (Windows/Super)
set $mod Mod4

# Apps
bindsym $mod+Return exec lxterminal
bindsym $mod+d exec rofi -show run
bindsym $mod+f exec thunar
bindsym $mod+b exec firefox-esr
bindsym $mod+e exec geany

# Workspaces
bindsym $mod+1 workspace 1
bindsym $mod+2 workspace 2
bindsym $mod+3 workspace 3

# Layout
bindsym $mod+h split h
bindsym $mod+v split v
bindsym $mod+s layout stacking
bindsym $mod+w layout tabbed
bindsym $mod+e layout toggle split

# System
bindsym $mod+Shift+q kill
bindsym $mod+Shift+c reload
bindsym $mod+Shift+r restart

# Start applications
exec --no-startup-id feh --bg-scale /usr/share/backgrounds/debian*
exec --no-startup-id thunar -d
EOF

cat > ~/.vnc/xstartup << 'EOF'
#!/bin/bash
export DISPLAY=:1
export XDG_RUNTIME_DIR=/tmp/runtime-root

xrdb $HOME/.Xresources
exec i3
EOF

chmod +x ~/.vnc/xstartup
vncserver -kill :1
vncserver -geometry 1024x768 -depth 24 -localhost no
# Fondo de pantalla
feh --bg-scale /usr/share/backgrounds/debian*
# Transparencias ligeras
picom &
apt install -y     xorg     i3     rofi     thunar     firefox-esr     geany     lxterminal     htop     feh     picom     tigervnc-standalone-server     git     curl     wget     vim     python3     python3-pip     nodejs     npm
mkdir -p ~/.config/i3
cat > ~/.config/i3/config << 'EOF'
# i3 config - MAX PERFORMANCE
font pango:DejaVu Sans Mono 9

# Mod key (Windows/Super)
set $mod Mod4

# Apps
bindsym $mod+Return exec lxterminal
bindsym $mod+d exec rofi -show run
bindsym $mod+f exec thunar
bindsym $mod+b exec firefox-esr
bindsym $mod+e exec geany

# Workspaces
bindsym $mod+1 workspace 1
bindsym $mod+2 workspace 2
bindsym $mod+3 workspace 3

# Layout
bindsym $mod+h split h
bindsym $mod+v split v
bindsym $mod+s layout stacking
bindsym $mod+w layout tabbed
bindsym $mod+e layout toggle split

# System
bindsym $mod+Shift+q kill
bindsym $mod+Shift+c reload
bindsym $mod+Shift+r restart

# Start applications
exec --no-startup-id thunar -d
EOF

mkdir -p ~/.vnc
cat > ~/.vnc/xstartup << 'EOF'
#!/bin/bash
export DISPLAY=:1
xrdb $HOME/.Xresources
exec i3
EOF

chmod +x ~/.vnc/xstartup
vncpasswd
vncserver -geometry 1024x768 -depth 24 -localhost no
# En Termux (dentro de Debian)
vncserver -list
apt install -y tigervnc-standalone-server
which vncserver
pkg install which
which vncserver
mkdir -p ~/.vnc
cat > ~/.vnc/xstartup << 'EOF'
#!/bin/bash
export DISPLAY=:1
xrdb $HOME/.Xresources
exec i3
EOF

chmod +x ~/.vnc/xstartup
vncpasswd
pkg install tigervnc
pkg install x11-repo     
vncpasswd
pkg install tigervnc
vncpasswd
vncserver -geometry 1024x768 -depth 24 -localhost no
apt list --installed | grep vnc
# Instalar XFCE + aplicaciones
apt install -y     xfce4     xfce4-goodies     firefox-esr     thunar     mousepad     ristretto     xfce4-terminal     tigervnc-standalone-server
cat > ~/.vnc/xstartup << 'EOF'
#!/bin/bash
export DISPLAY=:1
xrdb $HOME/.Xresources
startxfce4 &
EOF

chmod +x ~/.vnc/xstartup
vncserver -kill :1
vncserver -geometry 1024x768 -depth 24 -localhost no
# Actualizar sistema primero
apt update && apt upgrade -y
# Instalar XFCE completo + extras avanzados
apt install -y     task-xfce-desktop     xfce4     xfce4-goodies     xfce4-power-manager     xfce4-pulseaudio-plugin     xfce4-screenshooter     xfce4-taskmanager     xfce4-terminal     xfce4-volumed-pulse     xfwm4     thunar     thunar-archive-plugin     thunar-media-tags-plugin     fire
mkdir -p ~/.vnc
cat > ~/.vnc/xstartup << 'EOF'
#!/bin/bash
export DISPLAY=:1
export XDG_CURRENT_DESKTOP=XFCE
export XDG_CONFIG_HOME=$HOME/.config
export XDG_DATA_HOME=$HOME/.local/share
export XDG_CACHE_HOME=$HOME/.cache

# Iniciar XFCE completo
startxfce4 &
EOF

chmod +x ~/.vnc/xstartup
apt install -y     greybird-gtk-theme     dmz-cursor-theme     faenza-icon-theme     arc-theme     numix-icon-theme     papirus-icon-theme
apt install -y     compton     xfce4-compositor
# Crear configuración personalizada
mkdir -p ~/.config/xfce4/xfconf/xfce-perchannel-xml
# Configurar para pantalla táctil
cat > ~/.config/xfce4/xfconf/xfce-perchannel-xml/xsettings.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<channel name="xsettings" version="1.0">
  <property name="Net" type="empty">
    <property name="ThemeName" type="string" value="Greybird"/>
    <property name="IconThemeName" type="string" value="Papirus"/>
    <property name="DoubleClickTime" type="int" value="400"/>
  </property>
</channel>
EOF

vncpasswd
vncserver -kill :1 2>/dev/null
vncserver -geometry 1280x720 -depth 24 -localhost no
# Verificar paquetes XFCE instalados
dpkg -l | grep xfce
# Verificar si hay sesión VNC corriendo
ps aux | grep vnc
pkill Xtigervnc
pkill vncserver
# Instalar solo lo esencial de XFCE
apt install -y --no-install-recommends     xfce4     xfce4-terminal     thunar     firefox-esr     mousepad
# Crear script mínimo que FUNCIONE
cat > ~/.vnc/xstartup << 'EOF'
#!/bin/bash
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
export DISPLAY=:1
export XDG_CURRENT_DESKTOP=XFCE
startxfce4
EOF

chmod +x ~/.vnc/xstartup
# Crear directorios necesarios
mkdir -p ~/.config/xfce4/xfconf
mkdir -p ~/.cache/sessions
# Establecer permisos
chmod 755 ~/.vnc
# Iniciar con logging detallado
vncserver -geometry 1024x768 -depth 24 -localhost no -Log *:stdout
cat > ~/.vnc/xstartup << 'EOF'
#!/bin/bash
export DISPLAY=:1

# Iniciar XFCE componentes manualmente
xfwm4 &
xfdesktop &
xfce4-panel &
xfce4-session &
thunar --daemon &
xfce4-terminal &
EOF

chmod +x ~/.vnc/xstartup
# En una terminal de Termux (NO en VNC)
tail -f ~/.vnc/*.log
dpkg -l | grep -i xfce
# Instalar el paquete COMPLETO de XFCE
apt install -y xfce4
proot-distro login debian
# Verificar si hay procesos VNC corriendo
ps aux | grep vnc
# Verificar puertos abiertos
netstat -tulpn 2>/dev/null | grep 590
# Entrar a Debian primero
proot-distro login debian
# Verificar si tigervnc está instalado
which vncserver
# Verificar sesiones VNC activas
vncserver -list
# Verificar logs de VNC
tail -f ~/.vnc/*.log
# En Termux normal ($)
echo "=== Procesos VNC ==="
ps aux | grep vnc
echo "=== Puertos 590X ==="
netstat -tulpn 2>/dev/null | grep 590
echo "=== Procesos X11 ==="
ps aux | grep X
pkill -f Xvnc
proot-distro login debian
exit
proot-distro login debian
exit
# Ver logs mientras inicias VNC
tail -f /data/data/com.termux/files/home/.vnc/*.log
# Ver qué displays están activos
vncserver -list
# Iniciar servidor VNC
vncserver :1
# Verificar que esté activo
vncserver -list
netstat -tlnp | grep 5901
ss -tlnp | grep 5901
ps aux | grep vnc
nc -z 127.0.0.1 5901 && echo "CONEXIÓN EXITOSA" || echo "ERROR DE CONEXIÓN"
pkg install busybox
busybox nc -z 127.0.0.1 5901 && echo "CONEXIÓN EXITOSA" || echo "ERROR DE CONEXIÓN"
exit
cd home
cd $home
# En el navegador:
- Zoom al 100% (no ampliado/reducido)
- Modo de alto contraste si está disponible
- Tamaño de fuente normal (no muy pequeño)
# En el sistema:
- Resolución nativa del monitor
- Escalado al 100% (no 125%/150%)
- Capturar en formato PNG, no JPEG
exit
# Solo ejecuta esto para preparar todo:
cd ~
mkdir -p apps/deepseek-server
cd apps/deepseek-server
npm init -y
npm install express axios cors
nano server.js
nano test-client.js
nano start-server.sh
chmod +x start-server.sh
# Edita server.js y cambia esta línea:
nano server.js
# Busca: const DEEPSEEK_API_KEY = 'tu-api-key-de-deepseek-aqui';
# Reemplaza con tu API key real de DeepSeek
# Opción 1: Directo
cd ~/apps/deepseek-server
node server.js
# Opción 2: Con script
./start-server.sh
# Detener el servidor si está corriendo
pkill -f node
# Editar el archivo correctamente
nano ~/apps/deepseek-server/server.js
# Ver las primeras líneas del archivo
head -5 ~/apps/deepseek-server/server.js
cd ~/apps/deepseek-server
./start-server.sh
# Verificar que los archivos están correctos
cd ~/apps/deepseek-server
ls -la
# Deberías ver:
# server.js    (sin API key en primeras líneas)
# config.js    (opcional, con la API key)
# start-server.sh
# Iniciar servidor
node server.js
# En otra pestaña/ventana de Termux:
curl http://localhost:3000
cd ~/apps/deepseek-server
# Iniciar con PM2 para que corra en background
pm2 start server.js --name "deepseek-api"
# Verificar que está corriendo
pm2 status
pkg update && pkg upgrade
pkg install nodejs
npm install -g pm2
cd ~/apps/deepseek-server
pm2 start server.js --name "deepseek-api"
pm2 status
pm2 startup
pm2 save
# Guardar la configuración actual (esto sí funciona)
pm2 save
# Cuando reinicies Termux, ejecuta:
pm2 resurrect
# Crear un directorio para scripts de inicio
mkdir -p ~/.termux/boot
# Crear un script de inicio
nano ~/.termux/boot/00-pm2-start.sh
chmod +x ~/.termux/boot/00-pm2-start.sh
pm2 status
# Iniciar aplicación
pm2 start server.js --name "deepseek-api"
# Guardar configuración
pm2 save
# Restaurar aplicaciones guardadas
pm2 resurrect
# Ver estado
pm2 status
# Monitorear
pm2 monit
# Logs
pm2 logs deepseek-api
# Al final de ~/.bashrc
if [ -x "$(command -v pm2)" ]; then     pm2 resurrect 2>/dev/null; fi
# SERVICIOS PRINCIPALES
✅ Docker Termux + Portainer (Gestión visual)
✅ Node.js + Python + Java (FullStack)
✅ PostgreSQL + Redis (Bases de datos élite)
✅ PM2 + Systemd (Procesos 24/7)
exit
# SERVICIOS PRINCIPALES
✅ Docker Termux + Portainer (Gestión visual)
✅ Node.js + Python + Java (FullStack)
✅ PostgreSQL + Redis (Bases de datos élite)
✅ PM2 + Systemd (Procesos 24/7)
#!/bin/bash
echo "🚀 Iniciando instalación del stack completo..."
# Actualizar sistema
pkg update && pkg upgrade -y
# Instalar herramientas básicas
pkg install -y curl wget git
# Docker en Termux (usando rootless)
pkg install -y docker
if ! command -v docker &> /dev/null; then     echo "❌ Docker no se pudo instalar";     exit 1; fi
# 1. Docker y Portainer
pkg install docker -y
docker run -d -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer-ce
# 2. Stack de desarrollo  
pkg install nodejs python openjdk-17 -y
# 3. Bases de datos
pkg install postgresql redis -y
# 4. Gestión de procesos
npm install -g pm2
# Ejecutar el selector de repositorios
termux-change-repo
# Ejecutar el selector de repositorios
termux-change-repo
# Actualizar con el nuevo repositorio
pkg update && pkg upgrade -y
# Instalar repositorios esenciales
pkg install -y root-repo x11-repo
# Instalar Docker para Termux
pkg install -y docker docker-compose
# O si no funciona, probar con:
pkg install -y tur-repo
pkg install -y docker
# Instalar Node.js
pkg install -y nodejs
# Verificar instalación
node --version
npm --version
# Instalar PM2 globalmente
npm install -g pm2
# Verificar PM2
pm2 --version
echo "=== Verificando instalaciones ==="
node --version || echo "Node.js no instalado"
npm --version || echo "NPM no disponible"
which pm2 && echo "✅ PM2 instalado" || echo "❌ PM2 no instalado"
# SERVICIOS PRINCIPALES
✅ Docker Termux + Portainer (Gestión visual)
✅ Node.js + Python + Java (FullStack)
✅ PostgreSQL + Redis (Bases de datos élite)
✅ PM2 + Systemd (Procesos 24/7)
# Actualización completa
pkg update && pkg upgrade -y
pkg install -y root-repo x11-repo
pkg install -y python nodejs git wget curl
# Instalar Docker en Termux (NUEVO MÉTODO)
pkg install -y docker docker-compose
export DOCKER_HOST=unix:///data/docker/run/docker.sock
# Crear directorio élite
mkdir ~/super-bot && cd ~/super-bot
# docker-compose.yml (SISTEMA COMPLETO)
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # ORQUESTADOR PRINCIPAL
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=termmux2024!
    volumes:
      - n8n_data:/home/node/.n8n

  # GESTIÓN VISUAL DOCKER
  portainer:
    image: portainer/portainer-ce
    ports:
      - "9000:9000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data

  # BASE DE DATOS ÉLITE
  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=superbot
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=termuxpro2024
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # CACHE Y COLA
  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data

  # PANEL DE CONTROL
  panel:
    image: node:18
    working_dir: /app
    volumes:
      - ./panel:/app
    ports:
      - "3000:3000"
    command: ["npm", "start"]

volumes:
  n8n_data:
  portainer_data:
  postgres_data:
  redis_data:
EOF

# Iniciar todos los servicios
docker-compose up -d
# Verificar estado
docker-compose ps
# Instalar como plugin de Docker
sudo apt update
sudo apt install docker-compose-plugin
# Luego puedes usar:
docker compose up -d
# Verificar versión
docker-compose --version
# o si usas el plugin:
docker compose --version
# Verificar que Docker funciona
docker --version
docker ps
# Iniciar el servicio Docker
sudo systemctl start docker
# Habilitar para que inicie automáticamente en el futuro
sudo systemctl enable docker
# Verificar estado
sudo systemctl status docker
exit

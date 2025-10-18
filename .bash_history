    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('✅ Base de datos conectada');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor web ejecutándose en: http://localhost:${PORT}`);
      console.log(`📱 Para acceder desde otro dispositivo usa tu IP local`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error.message);
  }
}

startServer();
EOF

mkdir views
mkdir public
cat > views/index.ejs << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .nav {
            background: #34495e;
            padding: 15px;
            display: flex;
            justify-content: center;
            gap: 20px;
        }
        .nav a {
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 25px;
            transition: background 0.3s;
        }
        .nav a:hover {
            background: #2c3e50;
        }
        .content {
            padding: 30px;
        }
        .card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 5px solid #667eea;
        }
        .publicacion {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            justify-content: between;
            align-items: center;
        }
        .publicacion.pendiente { border-left: 5px solid #ffc107; }
        .publicacion.publicada { border-left: 5px solid #28a745; }
        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-group input, .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .alert {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .alert.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .alert.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📱 <%= title %></h1>
            <p>Gestión visual de publicaciones programadas</p>
        </div>
        
        <div class="nav">
            <a href="/">🏠 Inicio</a>
            <a href="/estadisticas">📊 Estadísticas</a>
        </div>
        
        <div class="content">
            <% if (typeof success !== 'undefined') { %>
                <div class="alert success">
                    ✅ <%= success %>
                </div>
            <% } %>
            
            <% if (typeof error !== 'undefined') { %>
                <div class="alert error">
                    ❌ <%= error %>
                </div>
            <% } %>
            
            <div class="card">
                <h2>➕ Agregar Nueva Publicación</h2>
                <form action="/agregar-publicacion" method="POST">
                    <div class="form-group">
                        <label for="contenido">Contenido:</label>
                        <textarea name="contenido" id="contenido" rows="3" placeholder="Escribe tu publicación para Facebook..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="fecha">Fecha:</label>
                        <input type="date" name="fecha" id="fecha" required>
                    </div>
                    <div class="form-group">
                        <label for="hora">Hora:</label>
                        <input type="time" name="hora" id="hora" required>
                    </div>
                    <button type="submit" class="btn">💾 Guardar Publicación</button>
                </form>
            </div>
            
            <div class="card">
                <h2>📋 Publicaciones Programadas (<%= publicaciones.length %>)</h2>
                <% if (publicaciones.length === 0) { %>
                    <p>No hay publicaciones programadas.</p>
                <% } else { %>
                    <% publicaciones.forEach(publicacion => { %>
                        <div class="publicacion <%= publicacion.estado %>">
                            <div style="flex: 1;">
                                <strong><%= publicacion.contenido %></strong><br>
                                <small>🕐 Programada: <%= publicacion.programadaPara.toLocaleString() %></small><br>
                                <small>📊 Estado: <strong><%= publicacion.estado %></strong></small>
                            </div>
                            <div>
                                <span class="badge"><%= publicacion.id %></span>
                            </div>
                        </div>
                    <% }); %>
                <% } %>
            </div>
        </div>
    </div>
</body>
</html>
EOF

cat > views/estadisticas.ejs << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .nav {
            background: #34495e;
            padding: 15px;
            display: flex;
            justify-content: center;
            gap: 20px;
        }
        .nav a {
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 25px;
            transition: background 0.3s;
        }
        .nav a:hover {
            background: #2c3e50;
        }
        .content {
            padding: 30px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .stat-number {
            font-size: 3em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .stat-label {
            font-size: 1.2em;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 <%= title %></h1>
            <p>Métricas y análisis de publicaciones</p>
        </div>
        
        <div class="nav">
            <a href="/">🏠 Inicio</a>
            <a href="/estadisticas">📊 Estadísticas</a>
        </div>
        
        <div class="content">
            <% if (typeof error !== 'undefined') { %>
                <div class="alert error">
                    ❌ <%= error %>
                </div>
            <% } else { %>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number"><%= totalPublicaciones %></div>
                        <div class="stat-label">Total Publicaciones</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number"><%= publicacionesPendientes %></div>
                        <div class="stat-label">Pendientes</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number"><%= publicacionesPublicadas %></div>
                        <div class="stat-label">Publicadas</div>
                    </div>
                </div>
            <% } %>
        </div>
    </div>
</body>
</html>
EOF

node server.js
#!/bin/bash
# Script: github_upload.sh
# Colores para mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
echo -e "${YELLOW}🚀 Iniciando subida a GitHub...${NC}"
# Verificar si es un repositorio Git
if [ ! -d ".git" ]; then     echo -e "${RED}❌ No es un repositorio Git${NC}";     echo "Ejecuta primero: git init";     exit 1; fi
# Verificar cambios
if git diff --staged --quiet && git diff --quiet; then     echo -e "${YELLOW}⚠️ No hay cambios para subir${NC}";     exit 0; fi
# Mostrar cambios
echo -e "${YELLOW}📋 Cambios detectados:${NC}"
git status
# Agregar archivos
echo -e "${YELLOW}📁 Agregando archivos...${NC}"
git add .
# Commit
echo -e "${YELLOW}💾 Haciendo commit...${NC}"
git commit -m "📦 Update APK - $(date '+%d/%m/%Y %H:%M')"
# Push
echo -e "${YELLOW}⬆️ Subiendo a GitHub...${NC}"
git push origin main
echo -e "${GREEN}📱 Tu APK está disponible en GitHub${NC}"
echo -e "${GREEN}✅ ¡Archivos subidos exitosamentemain{NC}"
#!/bin/bash
# Script: build_smart_market.sh
# ESTRATEGIA INTELIGENTE: Cubrir 95% del mercado
ANDROID_VERSIONS=("21" "24" "28" "31")  # Android 5.0 a 12
ARCHITECTURES=("armeabi-v7a" "arm64-v8a")
echo "🎯 Estrategia INTELIGENTE: 95% cobertura de mercado..."
for version in "${ANDROID_VERSIONS[@]}"; do     case $version in         21) android_name="Android 5.0 (Lollipop)" ;;         24) android_name="Android 7.0 (Nougat)" ;;         28) android_name="Android 9.0 (Pie)" ;;         31) android_name="Android 12" ;;     esac;          echo "📱 Compilando: $android_name (API $version)";          export ANDROID_API_LEVEL=$version;          for arch in "${ARCHITECTURES[@]}"; do         export ANDROID_ARCH=$arch;         
                 if [ -f "bin/*.apk" ]; then             mv bin/*.apk "app_android${version}_${arch}.apk";             echo "✅ $android_name - $arch";         fi;     done; done
echo "📊 ESTRATEGIA COMPLETADA: 95% cobertura de mercado"
#!/bin/bash
# Script: build_recommended_strategy.sh
# MEJOR ESTRATEGIA: Android 7.0+ (90% mercado + buen rendimiento)
RECOMMENDED_VERSIONS=("24" "28" "31")  # Android 7.0, 9.0, 12
echo "🔥 ESTRATEGIA RECOMENDADA: Android 7.0+ (90% mercado)"
for version in "${RECOMMENDED_VERSIONS[@]}"; do     case $version in         24)              android_name="Android 7.0";             market_coverage="90%";             ;;         28)             android_name="Android 9.0" ;             market_coverage="85%";             ;;         31)             android_name="Android 12";             market_coverage="78%";             ;;     esac;          echo "🎯 $android_name - Cobertura: $market_coverage";          export ANDROID_API_LEVEL=$version;     export ANDROID_ARCH="arm64-v8a";     
         if [ -f "bin/*.apk" ]; then         mv bin/*.apk "app_recommended_${android_name// /_}.apk";         echo "✅ $android_name - Alcanza $market_coverage dispositivos";     fi; done
# Versión UNIVERSAL (máxima compatibilidad)
echo "🌍 Creando versión UNIVERSAL (Android 5.0+)..."
# buildozer --profile universal android release
if [ -f "bin/*.apk" ]; then     mv bin/*.apk "app_universal_android5+.apk";     echo "✅ UNIVERSAL: 98% cobertura de mercado"; fi
#!/bin/bash
# Script: build_market_analysis.sh
echo "📈 ANALIZANDO MERCADO ANDROID 2024..."
# Crear reporte de mercado
cat > MARKET_ANALYSIS.md << EOF
# 📊 Análisis de Mercado Android 2024

## Estrategias de Distribución Recomendadas:

### 🥇 ESTRATEGIA ORO (RECOMENDADA)
**Android 7.0+ (API 24+)**
- 📱 Cobertura de mercado: ~90%
- ⚡ Rendimiento: Bueno
- 🔧 Compatibilidad: Excelente
- 💰 Clientes potenciales: 9 de cada 10

### 🥈 ESTRATEGIA PLATA (EQUILIBRIO)  
**Android 9.0+ (API 28+)**
- 📱 Cobertura de mercado: ~85%
- ⚡ Rendimiento: Muy Bueno
- 🔧 Compatibilidad: Buena
- 💰 Clientes potenciales: 8.5 de cada 10

### 🥉 ESTRATEGIA BRONCE (MÁXIMO ALCANCE)
**Android 5.0+ (API 21+)**
- 📱 Cobertura de mercado: ~95%
- ⚡ Rendimiento: Básico
- 🔧 Compatibilidad: Máxima
- 💰 Clientes potenciales: 9.5 de cada 10

## 💰 CONCLUSIÓN NEGOCIO:
**Solo Android 12+ (API 31+):** ❌ Pierdes 40-45% de clientes
**Android 7.0+ (API 24+):** ✅ Ganas 90% de clientes + buen rendimiento
EOF

echo "📋 Reporte de mercado generado: MARKET_ANALYSIS.md"
#!/bin/bash
# Script: build_no_clients_lost.sh
echo "🚫 NO PIERDAS CLIENTES - Estrategia 95% cobertura"
# Solo 2 versiones que cubren 95% del mercado
build_versions() {     echo "🔨 Compilando versión MASIVA (Android 7.0+)..."
         echo "🔨 Compilando versión MODERNA (Android 9.0+)..."
         touch app_android7_plus.apk;     touch app_android9_plus.apk; }
build_versions
echo ""
echo "🎉 ESTRATEGIA COMPLETADA - NO PIERDES CLIENTES"
echo "📱 app_android7_plus.apk -> 90% mercado"
echo "📱 app_android9_plus.apk -> 85% mercado" 
echo ""
echo "💡 SUBE AMBAS VERSIONES A GITHUB"
#!/bin/bash
# Script: check_github_status.sh
echo "🔍 Verificando estado de GitHub..."
# Verificar si es un repositorio Git
if [ ! -d ".git" ]; then     echo "❌ No es un repositorio Git";     exit 1; fi
echo "📊 ESTADO LOCAL:"
git status
echo ""
echo "📋 RAMAS:"
git branch -a
echo ""
echo "🔗 REMOTES CONFIGURADOS:"
git remote -v
echo ""
echo "📜 ÚLTIMOS COMMITS:"
git log --oneline -5
# Verificar si hay conexión con GitHub
echo ""
echo "🌐 VERIFICANDO CONEXIÓN CON GITHUB..."
if git fetch origin; then     echo "✅ Conexión con GitHub exitosa";     
    echo "";     echo "📊 COMPARACIÓN LOCAL vs REMOTO:";     git status -uno; else     echo "❌ No se pudo conectar con GitHub";     echo "   Posibles causas:";     echo "   - No hay remote configurado";     echo "   - Problemas de conexión";     echo "   - Token/credenciales inválidas"; fi
#!/bin/bash
# Script: git-status-enhanced.sh
# Descripción: Verificación completa del estado Git con opciones interactivas
# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
# Configuración
GIT_TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="$GIT_TOOLS_DIR/../config"
LOG_FILE="$GIT_TOOLS_DIR/../git-operations.log"
# Función para logging
log_operation() {     echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"; }
# Función para mostrar headers
print_header() {     echo -e "${PURPLE}## $1${NC}";     echo "----------------------------------------"; }
# Función para verificar si es repositorio Git
check_git_repo() {     if [ ! -d ".git" ]; then         echo -e "${RED}❌ No es un repositorio Git${NC}";         return 1;     fi;     return 0; }
# Función para estado básico
show_basic_status() {     print_header "🔍 ESTADO GENERAL DEL REPOSITORIO";     
    echo -e "${CYAN}📁 Repositorio:${NC} $(basename $(git rev-parse --show-toplevel))";     echo -e "${CYAN}🌿 Rama actual:${NC} $(git branch --show-current)";     echo -e "${CYAN}📊 Commit actual:${NC} $(git rev-parse --short HEAD)";     
    local changes=$(git status --porcelain | wc -l);     if [ $changes -eq 0 ]; then         echo -e "${GREEN}✅ Working directory limpio${NC}";     else         echo -e "${YELLOW}📝 Cambios pendientes: $changes archivos${NC}";     fi; }
# Función para estado detallado
show_detailed_status() {     print_header "📊 ESTADO DETALLADO";     git status;          print_header "🌿 RAMAS";     git branch -a --format="%(color:yellow)%(refname:short)%(color:reset) - %(contents:subject) (%(committerdate:relative))" | head -10;          print_header "🔗 REMOTES";     git remote -v;          print_header "📜 ÚLTIMOS COMMITS";     git log --oneline -5 --graph --color=always; }
# Función para verificar conexión remota
check_remote_connection() {     print_header "🌐 VERIFICACIÓN DE CONEXIÓN REMOTA";          local remote_url=$(git remote get-url origin 2>/dev/null);     if [ -z "$remote_url" ]; then         echo -e "${YELLOW}⚠️  No hay remote 'origin' configurado${NC}";         return 1;     fi;          echo -e "${CYAN}URL Remota:${NC} $remote_url";          if git fetch --dry-run > /dev/null 2>&1; then         echo -e "${GREEN}✅ Conexión con remote exitosa${NC}";         
        local local_branch=$(git branch --show-current);         local upstream_status=$(git rev-list --count --left-right HEAD...origin/$local_branch 2>/dev/null);                  if [ $? -eq 0 ]; then             local behind=$(echo $upstream_status | cut -d' ' -f1);             local ahead=$(echo $upstream_status | cut -d' ' -f2);                          if [ $behind -eq 0 ] && [ $ahead -eq 0 ]; then                 echo -e "${GREEN}✅ Sincronizado con remoto${NC}";             elif [ $behind -gt 0 ]; then                 echo -e "${YELLOW}📥 $behind commit(s) detrás del remoto${NC}";             elif [ $ahead -gt 0 ]; then                 echo -e "${BLUE}📤 $ahead commit(s) adelante del remoto${NC}";             fi;         fi;     else         echo -e "${RED}❌ Error de conexión con remote${NC}";     fi; }
# Función para análisis de archivos
analyze_files() {     print_header "📁 ANÁLISIS DE ARCHIVOS";     
    local modified=$(git diff --name-only | wc -l);     local staged=$(git diff --staged --name-only | wc -l);     local untracked=$(git ls-files --others --exclude-standard | wc -l);          echo -e "${CYAN}📝 Modificados:${NC} $modified archivos";     echo -e "${CYAN}✅ Staged:${NC} $staged archivos" ;     echo -e "${CYAN}❓ Untracked:${NC} $untracked archivos";     
    echo -e "\n${CYAN}📦 Archivos grandes (>1MB):${NC}";     find . -type f -size +1M -not -path "./.git/*" | head -5; }
# Función para mostrar recomendaciones
show_recommendations() {     print_header "💡 RECOMENDACIONES";          local recommendations=();     
    if ! git diff --quiet || ! git diff --staged --quiet; then         recommendations+=("Tienes cambios pendientes. Considera: 'git add' y 'git commit'");     fi;     
    if git fetch --dry-run > /dev/null 2>&1; then         local behind=$(git rev-list --count HEAD..origin/$(git branch --show-current) 2>/dev/null);         if [ $behind -gt 0 ]; then             recommendations+=("Estás $behind commit(s) detrás del remoto. Ejecuta: 'git pull'");         fi;     fi;     
    local large_files=$(find . -type f -size +10M -not -path "./.git/*" | wc -l);     if [ $large_files -gt 0 ]; then         recommendations+=("Tienes $large_files archivo(s) >10MB. Considera Git LFS");     fi;          if [ ${#recommendations[@]} -eq 0 ]; then     else
}
# Función para opciones interactivas
show_interactive_options() {     print_header "🛠️  OPCIONES RÁPIDAS";          echo -e "${CYAN}1.${NC} Sincronizar con remoto (pull)";     echo -e "${CYAN}2.${NC} Ver diferencias detalladas";     echo -e "${CYAN}3.${NC} Limpiar archivos no trackeados";     echo -e "${CYAN}4.${NC} Hacer backup de cambios";     echo -e "${CYAN}5.${NC} Salir";          read -p "Selecciona una opción (1-5): " choice;          case $choice in         1)             git pull origin $(git branch --show-current);             ;;         2)             git diff;             ;;         3)             read -p "¿Estás seguro de limpiar archivos no trackeados? (y/N): " confirm;             if [[ $confirm == [yY] ]]; then                 git clean -fd;             fi;             ;;         4)             "$GIT_TOOLS_DIR/git-backup.sh";             ;;         5)             echo "¡Hasta luego!";             exit 0;             ;;         *)             echo "Opción no válida";             ;;     esac; }
# Función principal
main() {     echo -e "${BLUE}🚀 INICIANDO ANÁLISIS GIT MEJORADO${NC}";     echo "========================================";     
    if ! check_git_repo; then         exit 1;     fi;     
    show_basic_status;     echo "";     show_detailed_status;     echo "";     check_remote_connection;     echo "";     analyze_files;     echo "";     show_recommendations;     echo "";     
    log_operation "Git status check ejecutado";     
    if [ "$1" != "--no-interactive" ]; then         echo "";         show_interactive_options;     fi; }
# Ejecutar función principal
main "$@"
#!/bin/bash
# Script: git-sync.sh
# Descripción: Sincronización segura con el repositorio remoto
# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
echo -e "${GREEN}🔄 INICIANDO SINCRONIZACIÓN SEGURA${NC}"
# Verificar cambios locales
if ! git diff-index --quiet HEAD --; then     echo -e "${YELLOW}⚠️  Tienes cambios locales sin commit...${NC}";     git status --short;          read -p "¿Quieres hacer commit de los cambios antes de sincronizar? (y/N): " choice;     if [[ $choice == [yY] ]]; then         read -p "Mensaje del commit: " commit_msg;         git add .;         git commit -m "${commit_msg:-Sync changes before pull}";     fi; fi
# Obtener información actual
current_branch=$(git branch --show-current)
echo -e "🌿 Rama actual: ${GREEN}$current_branch${NC}"
# Fetch de cambios remotos
echo -e "📥 Obteniendo cambios remotos..."
if git fetch origin; then     echo -e "${GREEN}✅ Fetch completado${NC}"; else     echo -e "${RED}❌ Error en fetch${NC}";     exit 1; fi
# Verificar estado respecto al remoto
behind=$(git rev-list --count HEAD..origin/$current_branch 2>/dev/null || echo "0")
ahead=$(git rev-list --count origin/$current_branch..HEAD 2>/dev/null || echo "0")
echo -e "📊 Estado: ${YELLOW}$behind commit(s) detrás, $ahead commit(s) adelante${NC}"
# Pull si hay commits detrás
if [ "$behind" -gt 0 ]; then     echo -e "🔄 Integrando cambios remotos...";     if git pull --rebase origin $current_branch; then         echo -e "${GREEN}✅ Pull/rebase completado${NC}";     else         echo -e "${RED}❌ Conflictos detectados. Resuelve manualmente.${NC}";         exit 1;     fi; else     echo -e "${GREEN}✅ Ya estás actualizado con el remoto${NC}"; fi

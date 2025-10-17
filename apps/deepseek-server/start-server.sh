#!/bin/bash
echo "🚀 Iniciando Servidor DeepSeek..."
cd ~/apps/deepseek-server

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no encontrado. Instala con: pkg install nodejs"
    exit 1
fi

# Verificar dependencias
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Iniciar servidor
echo "✅ Iniciando servidor en puerto 3000..."
node server.js

#!/bin/bash
echo "🚀 Iniciando entorno de desarrollo..."

# Iniciar Docker
pkill dockerd 2>/dev/null
mkdir -p ~/.docker/data ~/.docker/run

dockerd \
  --data-root ~/.docker/data \
  --host unix://$HOME/.docker/docker.sock \
  --iptables=false \
  --ip-masq=false \
  --bridge=none \
  > /dev/null 2>&1 &

echo "⏳ Esperando Docker..."
sleep 15

export DOCKER_HOST=unix://$HOME/.docker/docker.sock

cd ~/dev/projects
echo "✅ Entorno listo en: $(pwd)"
echo "📊 Usa: docker compose up -d"

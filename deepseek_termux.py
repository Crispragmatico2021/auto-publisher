#!/usr/bin/env python3
import requests
import json
import os
import subprocess
import readline

# Configuración
API_KEY = "sk-58e157bd0e554470aaac03fdc0633072"
API_URL = "https://api.deepseek.com/v1/chat/completions"

class DeepSeekTermux:
    def __init__(self):
        self.history = []
        self.session_file = "deepseek_history.txt"
        self.load_history()
    
    def load_history(self):
        try:
            if os.path.exists(self.session_file):
                with open(self.session_file, 'r', encoding='utf-8') as f:
                    self.history = [line.strip() for line in f.readlines()]
        except:
            self.history = []
    
    def save_history(self, text):
        try:
            with open(self.session_file, 'a', encoding='utf-8') as f:
                f.write(text + '\n')
            self.history.append(text)
        except:
            pass
    
    def chat_with_deepseek(self):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        }
        
        print("\n🤖 🎯 DEEPSEEK TERMUX PRO 🎯")
        print("🔹 Escribe comandos naturales en español")
        print("🔹 Escribe 'comando' para modo terminal")
        print("🔹 Escribe 'salir' para terminar")
        print("═" * 50)
        
        while True:
            try:
                user_input = input("\n👤 Tú: ").strip()
                
                if user_input.lower() in ['salir', 'exit', 'quit']:
                    print("¡Hasta luego! 👋")
                    break
                
                if user_input.lower() in ['clear', 'limpiar']:
                    os.system('clear')
                    continue
                
                if user_input.lower() == 'comando':
                    self.modo_terminal()
                    continue
                
                if not user_input:
                    continue
                
                # Guardar en historial
                self.save_history(f"Tú: {user_input}")
                
                # Preparar mensaje para DeepSeek
                messages = [{"role": "user", "content": user_input}]
                
                data = {
                    "model": "deepseek-chat",
                    "messages": messages,
                    "stream": False,
                    "temperature": 0.7
                }
                
                print("🔄 Procesando...")
                
                response = requests.post(API_URL, headers=headers, json=data, timeout=60)
                
                if response.status_code == 401:
                    print("❌ Error: API Key inválida")
                    continue
                elif response.status_code == 429:
                    print("❌ Límite de tasa excedido. Espera un momento.")
                    continue
                
                response.raise_for_status()
                
                result = response.json()
                answer = result['choices'][0]['message']['content']
                
                print(f"\n🤖 DeepSeek: {answer}")
                
                # Guardar respuesta en historial
                self.save_history(f"DeepSeek: {answer}")
                
            except requests.exceptions.Timeout:
                print("❌ Timeout: La solicitud tardó demasiado")
            except requests.exceptions.ConnectionError:
                print("❌ Error de conexión: Verifica tu internet")
            except Exception as e:
                print(f"❌ Error: {e}")
    
    def modo_terminal(self):
        print("\n💻 🚀 MODO TERMINAL ACTIVADO 🚀")
        print("Escribe comandos de Linux directamente")
        print("Escribe 'volver' para regresar al chat")
        print("─" * 40)
        
        while True:
            try:
                cmd = input("\n💻 Comando $ ").strip()
                
                if cmd.lower() in ['volver', 'back', 'exit']:
                    break
                
                if not cmd:
                    continue
                
                if cmd.lower() in ['clear', 'limpiar']:
                    os.system('clear')
                    continue
                
                # Ejecutar comando
                print(f"⚡ Ejecutando: {cmd}")
                resultado = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
                
                if resultado.stdout:
                    print(f"📋 Salida:\n{resultado.stdout}")
                
                if resultado.stderr:
                    print(f"⚠️ Errores:\n{resultado.stderr}")
                    
                if resultado.returncode != 0:
                    print(f"❌ Código de salida: {resultado.returncode}")
                    
            except subprocess.TimeoutExpired:
                print("❌ El comando tardó demasiado y fue detenido")
            except Exception as e:
                print(f"❌ Error ejecutando comando: {e}")

if __name__ == "__main__":
    deepseek = DeepSeekTermux()
    deepseek.chat_with_deepseek()

#!/usr/bin/env python3
import requests
import json

# REEMPLAZA ESTO CON TU API KEY REAL Y COMPLETA
API_KEY = "sk-58e157bd0e554470aaac03fdc0633072"
API_URL = "https://api.deepseek.com/v1/chat/completions"

def verificar_api_key():
    if API_KEY.startswith("sk-") and len(API_KEY) < 20:
        print("❌ ERROR: API Key parece incompleta")
        print("   Obtén una API key válida en: https://platform.deepseek.com/api_keys")
        return False
    return True

def chat_with_deepseek():
    if not verificar_api_key():
        return
        
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    print("🤖 DeepSeek Chat - Escribe 'salir' para terminar")
    print("-" * 40)
    
    while True:
        user_input = input("\n👤 Tú: ")
        
        if user_input.lower() in ['salir', 'exit', 'quit']:
            print("¡Hasta luego! 👋")
            break
            
        if not user_input.strip():
            continue
            
        try:
            data = {
                "model": "deepseek-chat",
                "messages": [{"role": "user", "content": user_input}],
                "stream": False
            }
            
            response = requests.post(API_URL, headers=headers, json=data, timeout=30)
            
            if response.status_code == 401:
                print("❌ Error 401: API Key inválida o expirada")
                print("   Verifica tu API key en: https://platform.deepseek.com/api_keys")
                continue
            elif response.status_code == 429:
                print("❌ Límite de tasa excedido. Espera un momento.")
                continue
                
            response.raise_for_status()
            
            result = response.json()
            answer = result['choices'][0]['message']['content']
            print(f"\n🤖 DeepSeek: {answer}")
            
        except Exception as e:
            print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    chat_with_deepseek()

const express = require('express');
const app = express();
const port = 8080;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Facebook AutoPublisher</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 40px; 
                background: #f0f2f5;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                padding: 30px; 
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #1877f2; }
            .btn { 
                background: #1877f2; 
                color: white; 
                padding: 12px 20px; 
                border: none; 
                border-radius: 6px; 
                margin: 5px; 
                cursor: pointer;
            }
            .btn:hover { background: #166fe5; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🤖 Facebook AutoPublisher</h1>
            <p>Interfaz web funcionando correctamente</p>
            <p>Para la interfaz completa, ejecuta la aplicación de terminal:</p>
            <code>node app.js</code>
            <br><br>
            <button class="btn" onclick="alert('Interfaz web activa')">Probar</button>
        </div>
    </body>
    </html>
    `);
});

app.listen(port, () => {
    console.log(`✅ Servidor web en: http://localhost:${port}`);
});

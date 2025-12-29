const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const { insertMessage, getAllMessages } = require('./database');
const whatsappService = require('./api/whatsapp');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// POST endpoint to save contact form messages
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
            success: false,
            error: 'All fields are required' 
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false,
            error: 'Invalid email format' 
        });
    }

    try {
        // Save to database
        insertMessage(name, email, subject, message, async (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Failed to save message' 
                });
            }

            console.log('\n=== NUEVO MENSAJE RECIBIDO ===');
            console.log('📧 De:', name);
            console.log('✉️  Email:', email);
            console.log('📝 Asunto:', subject);
            console.log('💬 Mensaje:', message);
            console.log('🕐 Fecha:', new Date().toLocaleString('es-CO'));
            console.log('============================\n');

            // Send WhatsApp notification (optional)
            try {
                await whatsappService.sendNotification({
                    name,
                    email,
                    subject,
                    message
                });
                console.log('✅ Notificación de WhatsApp enviada');
            } catch (whatsappError) {
                console.log('⚠️  WhatsApp notification no disponible (configurar API)');
                console.log('💡 Los mensajes están guardados en la base de datos');
            }

            res.status(201).json({ 
                success: true,
                message: 'Message received successfully',
                id: result.id
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error' 
        });
    }
});

// GET endpoint to retrieve all messages (for viewing in console or admin panel)
app.get('/api/messages', (req, res) => {
    getAllMessages((err, messages) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                success: false,
                error: 'Failed to retrieve messages' 
            });
        }

        res.json({ 
            success: true,
            count: messages.length,
            messages 
        });
    });
});

// Simple admin view to see messages (HTML page)
app.get('/admin/messages', (req, res) => {
    getAllMessages((err, messages) => {
        if (err) {
            return res.status(500).send('Error loading messages');
        }

        let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mensajes - Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0f0f0f;
            color: #fff;
            padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 {
            color: #00d4ff;
            margin-bottom: 30px;
            text-align: center;
        }
        .stats {
            background: #1a1a1a;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            border: 1px solid #2a2a2a;
        }
        .message-card {
            background: #1a1a1a;
            border: 1px solid #2a2a2a;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            transition: all 0.3s;
        }
        .message-card:hover {
            border-color: #00d4ff;
            box-shadow: 0 5px 15px rgba(0, 212, 255, 0.2);
        }
        .message-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #2a2a2a;
        }
        .message-from { color: #00d4ff; font-weight: bold; }
        .message-email { color: #b0b0b0; font-size: 0.9em; }
        .message-date { color: #808080; font-size: 0.85em; }
        .message-subject {
            color: #7c3aed;
            font-size: 1.1em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .message-body {
            color: #b0b0b0;
            line-height: 1.6;
            white-space: pre-wrap;
        }
        .refresh-btn {
            background: linear-gradient(135deg, #00d4ff, #7c3aed);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            margin-bottom: 20px;
            transition: all 0.3s;
        }
        .refresh-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 212, 255, 0.5);
        }
        .no-messages {
            text-align: center;
            padding: 50px;
            color: #808080;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📬 Mensajes del Portafolio</h1>
        
        <div class="stats">
            <h2>📊 Total de mensajes: ${messages.length}</h2>
        </div>
        
        <button class="refresh-btn" onclick="location.reload()">🔄 Actualizar</button>
        
        ${messages.length === 0 ? 
            '<div class="no-messages">No hay mensajes todavía</div>' :
            messages.map(msg => `
                <div class="message-card">
                    <div class="message-header">
                        <div>
                            <div class="message-from">👤 ${msg.name}</div>
                            <div class="message-email">✉️ ${msg.email}</div>
                        </div>
                        <div class="message-date">📅 ${new Date(msg.created_at).toLocaleString('es-CO')}</div>
                    </div>
                    <div class="message-subject">📝 ${msg.subject}</div>
                    <div class="message-body">${msg.message}</div>
                </div>
            `).join('')
        }
    </div>
</body>
</html>
        `;
        
        res.send(html);
    });
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        error: 'Endpoint not found' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false,
        error: 'Internal server error' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║          🚀 Servidor del Portafolio Iniciado              ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  📱 Portafolio: http://localhost:${PORT}                    ║`);
    console.log(`║  📬 Ver mensajes: http://localhost:${PORT}/admin/messages   ║`);
    console.log(`║  📊 API Status: http://localhost:${PORT}/api/health         ║`);
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  💡 Los mensajes se mostrarán aquí cuando lleguen         ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Cerrando servidor...');
    process.exit(0);
});

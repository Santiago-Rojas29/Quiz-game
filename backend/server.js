const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ PARA PRODUCCIÓN: Frontend y backend en MISMA carpeta
const frontendPath = path.join(__dirname, 'frontend');
const frontendExists = require('fs').existsSync(frontendPath);

if (frontendExists) {
    app.use(express.static(frontendPath));
    console.log('✅ Frontend static files served from:', frontendPath);
} else {
    console.log('⚠️ Frontend folder not found, serving from root');
    app.use(express.static(path.join(__dirname)));
}

// ✅ CARGAR RUTAS con manejo de errores
try {
    app.use('/api/questions', require('./routes/questions'));
    app.use('/api/scores', require('./routes/scores'));
    console.log('✅ API routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading routes:', error);
}

// Rutas de API
app.get('/api/health', (req, res) => {
    try {
        const db = require('./config/database');
        db.get("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
            if (err) {
                res.status(500).json({ 
                    success: false, 
                    message: 'Database error',
                    error: err.message 
                });
            } else {
                res.json({ 
                    success: true, 
                    message: 'Server and database are running!',
                    timestamp: new Date().toISOString(),
                    environment: process.env.NODE_ENV || 'development'
                });
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Database not available',
            error: error.message 
        });
    }
});

// Ruta principal - servir el frontend
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'frontend', 'index.html');
    if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Ruta comodín para SPA
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ 
            success: false, 
            error: 'API endpoint not found',
            path: req.path
        });
    }
    
    // Para SPA, servir index.html
    const indexPath = path.join(__dirname, 'frontend', 'index.html');
    if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('🚨 Error:', err.stack);
    res.status(500).json({ 
        success: false,
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
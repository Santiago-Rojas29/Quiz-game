const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ VERIFICAR y servir frontend desde múltiples ubicaciones posibles
let frontendPath;

// Opción 1: Frontend en ../frontend (estructura actual)
const frontendPath1 = path.join(__dirname, '..', 'frontend');
// Opción 2: Frontend en ./frontend (si lo movemos dentro de backend)
const frontendPath2 = path.join(__dirname, 'frontend');
// Opción 3: Frontend en raíz del proyecto
const frontendPath3 = path.join(__dirname, '..', '..', 'frontend');

if (fs.existsSync(frontendPath1)) {
    frontendPath = frontendPath1;
    console.log('✅ Frontend found at:', frontendPath1);
} else if (fs.existsSync(frontendPath2)) {
    frontendPath = frontendPath2;
    console.log('✅ Frontend found at:', frontendPath2);
} else if (fs.existsSync(frontendPath3)) {
    frontendPath = frontendPath3;
    console.log('✅ Frontend found at:', frontendPath3);
} else {
    console.log('❌ Frontend folder not found in any location');
    console.log('🔍 Checked locations:');
    console.log('   -', frontendPath1);
    console.log('   -', frontendPath2);
    console.log('   -', frontendPath3);
}

// Servir archivos estáticos del frontend si se encontró
if (frontendPath && fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    console.log('✅ Serving static files from:', frontendPath);
}

// Rutas API con manejo de errores robusto
try {
    if (fs.existsSync(path.join(__dirname, 'routes', 'questions.js'))) {
        app.use('/api/questions', require('./routes/questions'));
        console.log('✅ Questions route loaded');
    } else {
        console.log('❌ Questions route file not found');
    }
} catch (error) {
    console.error('❌ Error loading questions route:', error.message);
}

try {
    if (fs.existsSync(path.join(__dirname, 'routes', 'scores.js'))) {
        app.use('/api/scores', require('./routes/scores'));
        console.log('✅ Scores route loaded');
    } else {
        console.log('❌ Scores route file not found');
    }
} catch (error) {
    console.error('❌ Error loading scores route:', error.message);
}

// Ruta de salud mejorada
app.get('/api/health', (req, res) => {
    const healthInfo = {
        success: true,
        message: 'Server is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        port: PORT,
        frontendPath: frontendPath || 'Not found'
    };
    console.log('❤️ Health check requested');
    res.json(healthInfo);
});

// Ruta principal - servir el frontend si existe
app.get('/', (req, res) => {
    if (frontendPath && fs.existsSync(frontendPath)) {
        const indexPath = path.join(frontendPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            console.log('🏠 Serving index.html from:', indexPath);
            res.sendFile(indexPath);
        } else {
            res.json({ 
                success: false, 
                message: 'Frontend index.html not found',
                availableRoutes: ['/api/health', '/api/questions', '/api/scores']
            });
        }
    } else {
        res.json({ 
            success: true, 
            message: 'Backend API is running!',
            availableRoutes: ['/api/health', '/api/questions', '/api/scores'],
            note: 'Frontend not deployed with backend'
        });
    }
});

// Ruta comodín para SPA - solo si frontend existe
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ 
            success: false, 
            error: 'API endpoint not found',
            path: req.path,
            availableEndpoints: ['/api/health', '/api/questions/*', '/api/scores/*']
        });
    }
    
    // Solo servir SPA si el frontend existe
    if (frontendPath && fs.existsSync(frontendPath)) {
        const indexPath = path.join(frontendPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).json({ 
                success: false, 
                error: 'Frontend not available'
            });
        }
    } else {
        res.status(404).json({ 
            success: false, 
            error: 'Endpoint not found',
            path: req.path
        });
    }
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('🚨 Global Error Handler:', err.message);
    res.status(500).json({ 
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Current directory: ${__dirname}`);
    console.log(`🔍 Frontend path: ${frontendPath || 'NOT FOUND'}`);
    console.log('='.repeat(50));
});
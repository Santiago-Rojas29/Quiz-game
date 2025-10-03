const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ CORREGIDO: Rutas para producción en Render
const frontendPath = path.join(__dirname, '..', 'frontend');
console.log('🔍 Looking for frontend at:', frontendPath);

// Servir archivos estáticos del frontend
app.use(express.static(frontendPath));

// Rutas API con manejo de errores
try {
    app.use('/api/questions', require('./routes/questions'));
    app.use('/api/scores', require('./routes/scores'));
    console.log('✅ API routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading routes:', error);
}

// Ruta de salud simple
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});

// Ruta principal - servir el frontend
app.get('/', (req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    console.log('🔍 Serving index from:', indexPath);
    res.sendFile(indexPath);
});

// Ruta comodín para SPA
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ 
            success: false, 
            error: 'API endpoint not found'
        });
    }
    const indexPath = path.join(frontendPath, 'index.html');
    res.sendFile(indexPath);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
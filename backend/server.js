const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Log todas las requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas API
try {
    app.use('/api/questions', require('./routes/questions'));
    console.log('✅ Questions route loaded');
} catch (error) {
    console.error('❌ Questions route error:', error.message);
}

try {
    app.use('/api/scores', require('./routes/scores'));
    console.log('✅ Scores route loaded');
} catch (error) {
    console.error('❌ Scores route error:', error.message);
}

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Quiz API is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Ruta raíz - información de la API
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Immersive Quiz API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            questions: '/api/questions/:modeId',
            scores: {
                save: 'POST /api/scores/save',
                get: 'GET /api/scores/mode/:modeId',
                rank: 'POST /api/scores/rank'
            }
        }
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('🚨 Error:', err.message);
    res.status(500).json({ 
        success: false,
        error: 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Quiz API running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('📚 Available endpoints:');
    console.log('   - GET  /api/health');
    console.log('   - GET  /api/questions/:modeId');
    console.log('   - POST /api/scores/save');
    console.log('   - GET  /api/scores/mode/:modeId');
    console.log('   - POST /api/scores/rank');
    console.log('='.repeat(50));
});
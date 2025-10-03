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

// Rutas API con manejo robusto de errores
try {
    if (require.resolve('./routes/questions')) {
        app.use('/api/questions', require('./routes/questions'));
        console.log('✅ Questions route loaded successfully');
    }
} catch (error) {
    console.error('❌ Questions route error:', error.message);
}

try {
    if (require.resolve('./routes/scores')) {
        app.use('/api/scores', require('./routes/scores'));
        console.log('✅ Scores route loaded successfully');
    }
} catch (error) {
    console.error('❌ Scores route error:', error.message);
}

// Ruta de salud mejorada
app.get('/api/health', (req, res) => {
    const db = require('./config/database');
    
    // Verificar estado de la base de datos
    db.get("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
        if (err) {
            res.json({ 
                success: false, 
                message: 'API running but database error',
                error: err.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.json({ 
                success: true, 
                message: 'Quiz API is fully operational!',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
                database: 'connected'
            });
        }
    });
});

// Ruta raíz - información de la API
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🎮 Immersive Quiz API',
        version: '1.0.0',
        description: 'Backend API for the Immersive Quiz Game',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: 'GET /api/health',
            questions: 'GET /api/questions/:modeId',
            scores: {
                save: 'POST /api/scores/save',
                getByMode: 'GET /api/scores/mode/:modeId',
                rank: 'POST /api/scores/rank',
                leaderboard: 'GET /api/scores/leaderboard/:modeId'
            }
        },
        documentation: 'Frontend available at: https://your-frontend-url.vercel.app'
    });
});

// Ruta para debug de la base de datos
app.get('/api/debug/tables', (req, res) => {
    const db = require('./config/database');
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ 
                tables: tables.map(t => t.name),
                count: tables.length
            });
        }
    });
});

// Manejo de rutas no encontradas
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'API endpoint not found',
        path: req.originalUrl,
        availableEndpoints: [
            'GET  /api/health',
            'GET  /api/questions/:modeId',
            'POST /api/scores/save',
            'GET  /api/scores/mode/:modeId', 
            'POST /api/scores/rank',
            'GET  /api/scores/leaderboard/:modeId',
            'GET  /api/debug/tables'
        ]
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('🚨 Global Error Handler:', err.message);
    console.error(err.stack);
    
    res.status(500).json({ 
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🎮 IMMERSIVE QUIZ API SERVER');
    console.log('='.repeat(60));
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    console.log('='.repeat(60));
    console.log('📚 AVAILABLE ENDPOINTS:');
    console.log('   • GET  /api/health           - Health check');
    console.log('   • GET  /api/questions/:mode  - Get questions by mode');
    console.log('   • POST /api/scores/save      - Save player score');
    console.log('   • GET  /api/scores/mode/:id  - Get scores by mode');
    console.log('   • POST /api/scores/rank      - Get player rank');
    console.log('   • GET  /api/debug/tables     - Database debug');
    console.log('='.repeat(60));
    console.log('💡 Tip: Frontend should connect to this API URL');
    console.log('='.repeat(60));
});
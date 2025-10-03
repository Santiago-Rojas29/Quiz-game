const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ ALMACENAMIENTO EN MEMORIA - COMPARTIDO ENTRE TODOS LOS USUARIOS
let scores = [
    // Datos de ejemplo
    {
        id: 1,
        player_name: "Champion",
        game_mode_id: 1,
        score: 150,
        time_seconds: 25,
        created_at: new Date().toISOString()
    },
    {
        id: 2, 
        player_name: "Pro Player",
        game_mode_id: 1,
        score: 120,
        time_seconds: 30,
        created_at: new Date().toISOString()
    }
];

// Log de requests
app.use((req, res, next) => {
    console.log(`📨 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ✅ GUARDAR SCORE
app.post('/api/scores/save', (req, res) => {
    try {
        const { player_name, game_mode_id, score, time_seconds } = req.body;
        
        console.log('💾 Saving score:', { player_name, game_mode_id, score, time_seconds });
        
        if (!player_name || game_mode_id === undefined || score === undefined || time_seconds === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        const newScore = {
            id: Date.now(),
            player_name: player_name.toString(),
            game_mode_id: parseInt(game_mode_id),
            score: parseInt(score),
            time_seconds: parseInt(time_seconds),
            created_at: new Date().toISOString()
        };
        
        scores.push(newScore);
        
        // Ordenar: mejor score primero, luego menor tiempo
        scores.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.time_seconds - b.time_seconds;
        });
        
        // Mantener top 100
        scores = scores.slice(0, 100);
        
        console.log('✅ Score saved. Total scores:', scores.length);
        
        res.json({
            success: true,
            message: 'Score saved successfully',
            scoreId: newScore.id
        });
        
    } catch (error) {
        console.error('❌ Error saving score:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// ✅ OBTENER SCORES POR MODO
app.get('/api/scores/mode/:modeId', (req, res) => {
    try {
        const modeId = parseInt(req.params.modeId);
        console.log(`📊 Loading scores for mode: ${modeId}`);
        
        const modeScores = scores
            .filter(score => score.game_mode_id === modeId)
            .slice(0, 20); // Top 20 por modo
            
        console.log(`✅ Sending ${modeScores.length} scores for mode ${modeId}`);
        
        res.json({
            success: true,
            scores: modeScores
        });
        
    } catch (error) {
        console.error('❌ Error loading scores:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// ✅ OBTENER RANK
app.post('/api/scores/rank', (req, res) => {
    try {
        const { player_name, game_mode_id, score, time_seconds } = req.body;
        
        console.log('🎯 Calculating rank for:', { player_name, game_mode_id, score, time_seconds });
        
        const modeScores = scores.filter(s => s.game_mode_id === parseInt(game_mode_id));
        
        let rank = 1;
        for (const s of modeScores) {
            if (s.score > parseInt(score) || (s.score === parseInt(score) && s.time_seconds < parseInt(time_seconds))) {
                rank++;
            }
        }
        
        console.log(`✅ Rank: ${rank}`);
        
        res.json({
            success: true,
            rank: rank
        });
        
    } catch (error) {
        console.error('❌ Error calculating rank:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// ✅ RUTA DE SALUD
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: '🚀 Quiz API is fully operational!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        stats: {
            totalScores: scores.length,
            memory: 'In-memory storage',
            shared: 'Scores shared across all devices'
        }
    });
});

// ✅ RUTA PRINCIPAL
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🎮 Immersive Quiz API',
        version: '1.0.0',
        status: 'LIVE & WORKING 🚀',
        note: 'Scores are shared across all devices!',
        endpoints: {
            health: 'GET /api/health',
            scores: {
                save: 'POST /api/scores/save',
                getByMode: 'GET /api/scores/mode/:modeId',
                rank: 'POST /api/scores/rank'
            }
        }
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('🚨 Global Error:', err.message);
    res.status(500).json({ 
        success: false,
        error: 'Something went wrong'
    });
});

app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🎮 IMMERSIVE QUIZ API - MEMORY STORAGE');
    console.log('='.repeat(60));
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Storage: In-memory (${scores.length} scores)`);
    console.log(`📱 Shared: Scores visible on all devices`);
    console.log('='.repeat(60));
});
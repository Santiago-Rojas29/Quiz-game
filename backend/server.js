const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ ALMACENAMIENTO EN MEMORIA (funciona en Render)
let scores = [];

// Log de requests
app.use((req, res, next) => {
    console.log(`📨 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ✅ GUARDAR SCORE (en memoria)
app.post('/api/scores/save', (req, res) => {
    try {
        const { player_name, game_mode_id, score, time_seconds } = req.body;
        
        console.log('💾 Saving score:', { player_name, game_mode_id, score, time_seconds });
        
        // Validar datos
        if (!player_name || !game_mode_id || score === undefined || time_seconds === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        // Crear nuevo score
        const newScore = {
            id: Date.now(), // ID único
            player_name,
            game_mode_id,
            score,
            time_seconds,
            created_at: new Date().toISOString()
        };
        
        // Agregar a la lista
        scores.push(newScore);
        
        // Ordenar por score (desc) y tiempo (asc)
        scores.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.time_seconds - b.time_seconds;
        });
        
        // Mantener solo los top 100 scores
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
        
        // Filtrar scores por modo
        const modeScores = scores.filter(score => score.game_mode_id === modeId);
        
        console.log(`✅ Found ${modeScores.length} scores for mode ${modeId}`);
        
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

// ✅ OBTENER RANK DEL JUGADOR
app.post('/api/scores/rank', (req, res) => {
    try {
        const { player_name, game_mode_id, score, time_seconds } = req.body;
        
        console.log('🎯 Calculating rank for:', { player_name, game_mode_id, score, time_seconds });
        
        // Filtrar scores del mismo modo
        const modeScores = scores.filter(s => s.game_mode_id === game_mode_id);
        
        // Calcular rank (jugadores con mejor score o mismo score pero menor tiempo)
        let rank = 1;
        for (const s of modeScores) {
            if (s.score > score || (s.score === score && s.time_seconds < time_seconds)) {
                rank++;
            }
        }
        
        console.log(`✅ Rank calculated: ${rank}`);
        
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
        message: 'Quiz API is running! 🚀',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        stats: {
            totalScores: scores.length,
            modes: {
                1: scores.filter(s => s.game_mode_id === 1).length,
                2: scores.filter(s => s.game_mode_id === 2).length,
                3: scores.filter(s => s.game_mode_id === 3).length
            }
        }
    });
});

// ✅ RUTA PRINCIPAL
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🎮 Immersive Quiz API',
        version: '1.0.0',
        status: 'LIVE 🚀',
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
    console.log('='.reinicializar(60));
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Storage: In-memory (${scores.length} scores)`);
    console.log('='.repeat(60));
});

const scoresController = {
    saveScore: (req, res) => {
        const { player_name, game_mode_id, score, time_seconds } = req.body;

        if (!player_name || !game_mode_id || !score || !time_seconds) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        Score.create({ player_name, game_mode_id, score, time_seconds }, (err, results) => {
            if (err) {
                console.error('Error saving score:', err);
                return res.status(500).json({ success: false, error: 'Database error' });
            }
            res.json({ 
                success: true, 
                message: 'Score saved successfully',
                scoreId: results.insertId 
            });
        });
    },
// ✅ ESTA FUNCIÓN DEBE EXISTIR
getScoresByMode: (req, res) => {
    const { modeId } = req.params;
    
    console.log('📥 Received request for scores, mode:', modeId);
    
    Score.getScoresByMode(modeId, (err, results) => {
        if (err) {
            console.error('❌ Error getting scores by mode:', err);
            return res.status(500).json({ 
                success: false, 
                error: 'Database error'
            });
        }
        
        console.log('✅ Sending scores response:', results.length, 'records');
        
        // ✅ ESTRUCTURA QUE ESPERA EL FRONTEND
        res.json({ 
            success: true,
            scores: results.map(score => ({
                player_name: score.player_name,
                score: score.score,
                time_seconds: score.time_seconds,
                date: score.created_at
            }))
        });
    });
},

    // ✅ CORREGIDO: Ahora usa POST con body
// ✅ CORREGIDO: Ahora usa POST con body y mejor manejo de errores
getPlayerRank: (req, res) => {
    console.log('📥 Received rank request body:', req.body);
    
    const { player_name, game_mode_id, score, time_seconds } = req.body;

    // ✅ Validación más detallada
    if (!player_name) {
        return res.status(400).json({ success: false, error: 'Missing player_name' });
    }
    if (!game_mode_id) {
        return res.status(400).json({ success: false, error: 'Missing game_mode_id' });
    }
    if (score === undefined || score === null) {
        return res.status(400).json({ success: false, error: 'Missing score' });
    }
    if (time_seconds === undefined || time_seconds === null) {
        return res.status(400).json({ success: false, error: 'Missing time_seconds' });
    }

    console.log('🔍 Calculating rank for:', {
        player_name, 
        game_mode_id, 
        score, 
        time_seconds
    });

    Score.getPlayerRank(game_mode_id, player_name, parseInt(score), parseInt(time_seconds), (err, results) => {
        if (err) {
            console.error('❌ Database error getting rank:', err);
            return res.status(500).json({ success: false, error: 'Database error' });
        }
        
        const rank = results ? results.rank : 1;
        console.log('🎯 Calculated rank:', rank);
        
        res.json({ 
            success: true,
            rank: rank
        });
    });
},
    getLeaderboard: (req, res) => {
        const { modeId } = req.params;
        const limit = parseInt(req.query.limit) || 10;

        Score.getLeaderboard(modeId, limit, (err, results) => {
            if (err) {
                console.error('Error getting leaderboard:', err);
                return res.status(500).json({ success: false, error: 'Database error' });
            }
            
            res.json({ 
                success: true,
                scores: results 
            });
        });
    }
};

module.exports = scoresController;
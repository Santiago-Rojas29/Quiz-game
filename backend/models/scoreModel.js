const db = require('../config/database');

const Score = {
    create: (scoreData, callback) => {
        const { player_name, game_mode_id, score, time_seconds } = scoreData;
        const query = `
            INSERT INTO scores (player_name, game_mode_id, score, time_seconds) 
            VALUES (?, ?, ?, ?)
        `;
        
        console.log('💾 Saving score to database:', { player_name, game_mode_id, score, time_seconds });
        
        db.run(query, [player_name, game_mode_id, score, time_seconds], function(err) {
            if (err) {
                console.error('❌ Error saving score:', err);
                callback(err, null);
            } else {
                console.log('✅ Score saved successfully, ID:', this.lastID);
                callback(null, { insertId: this.lastID });
            }
        });
    },

    getLeaderboard: (modeId, limit = 10, callback) => {
        const query = `
            SELECT player_name, score, time_seconds, created_at 
            FROM scores 
            WHERE game_mode_id = ? 
            ORDER BY score DESC, time_seconds ASC 
            LIMIT ?
        `;
        
        console.log('📊 Getting leaderboard for mode:', modeId, 'limit:', limit);
        
        db.all(query, [modeId, limit], (err, rows) => {
            if (err) {
                console.error('❌ Error getting leaderboard:', err);
                callback(err, null);
            } else {
                console.log('✅ Leaderboard retrieved, rows:', rows.length);
                callback(null, rows);
            }
        });
    },

    getPlayerRank: (modeId, playerName, score, time, callback) => {
        const query = `
            SELECT COUNT(*) + 1 as rank
            FROM scores 
            WHERE game_mode_id = ? AND (score > ? OR (score = ? AND time_seconds < ?))
        `;
        
        console.log('🎯 Calculating rank with params:', {
            modeId, 
            playerName, 
            score, 
            time
        });
        
        db.get(query, [modeId, score, score, time], (err, row) => {
            if (err) {
                console.error('❌ Rank query error:', err);
                callback(err, null);
            } else {
                const rank = row ? row.rank : 1;
                console.log('✅ Calculated rank:', rank);
                callback(null, { rank: rank });
            }
        });
    },

    // ✅ NUEVO: Método para obtener scores por modo (que usa el frontend)
getScoresByMode: (modeId, callback) => {
    const query = `
        SELECT player_name, score, time_seconds, created_at 
        FROM scores 
        WHERE game_mode_id = ? 
        ORDER BY score DESC, time_seconds ASC
    `;
    
    console.log('📈 Getting scores for mode:', modeId);
    
    db.all(query, [modeId], (err, rows) => {
        if (err) {
            console.error('❌ Error getting scores by mode:', err);
            callback(err, null);
        } else {
            console.log('✅ Scores retrieved for mode', modeId + ':', rows.length, 'records');
            callback(null, rows);
        }
    });
}
};

module.exports = Score;
const db = require('../config/database');

const Question = {
    getByMode: (modeId, callback) => {
        const query = 'SELECT * FROM questions WHERE game_mode_id = ? ORDER BY RANDOM()';
        db.all(query, [modeId], callback);
    },

    getGameModes: (callback) => {
        const query = 'SELECT * FROM game_modes';
        db.all(query, callback);
    },

    getDifficultyConfig: () => {
        return {
            'easy': { count: 10, points: 10, label: 'Easy' },
            'medium': { count: 10, points: 20, label: 'Medium' },
            'hard': { count: 4, points: 30, label: 'Hard' }
        };
    }
};

module.exports = Question;
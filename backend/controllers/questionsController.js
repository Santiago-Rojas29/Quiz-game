const Question = require('../models/questionModel');

const questionsController = {
    getGameModes: (req, res) => {
        Question.getGameModes((err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
    },

    getQuestionsByMode: (req, res) => {
        const { modeId } = req.params;
        
        Question.getByMode(modeId, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            const formattedQuestions = results.map(q => ({
                q: q.question_text,
                opts: [q.option_a, q.option_b, q.option_c, q.option_d],
                a: ['a', 'b', 'c', 'd'].indexOf(q.correct_answer.toLowerCase()),
                diff: q.difficulty,
                img: q.image_url
            }));

            res.json({
                questions: formattedQuestions,
                difficultyConfig: Question.getDifficultyConfig()
            });
        });
    },

    getConfig: (req, res) => {
        res.json({
            difficultyConfig: Question.getDifficultyConfig()
        });
    }
};

module.exports = questionsController;
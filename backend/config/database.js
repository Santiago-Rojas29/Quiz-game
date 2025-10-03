const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database successfully!');
        initDatabase();
    }
});

function initDatabase() {
    // Definir las variables aquí para que estén en el scope correcto
    const modes = [
        ['general-culture', 'Varied questions on Interrogative Words, Culture General and Ask Questions'],
        ['english-grammar', 'Measure your level in the structure and use of the language'],
        ['colombian-culture', 'Knowledge about Colombian geography, history, and traditions']
    ];

    const questions = [
        [1, '____ is the capital of France?', 'What', 'Where', 'Which', 'Who', 'b', 'easy', 'https://source.unsplash.com/800x450/?paris,france', 10],
        [1, '____ many continents are there in the world?', 'What', 'How', 'Where', 'When', 'b', 'easy', 'https://source.unsplash.com/800x450/?world,map', 10],
        [1, '____ did the Second World War end?', 'How', 'What', 'When', 'Who', 'c', 'easy', 'https://source.unsplash.com/800x450/?historical,date', 10],
        [2, 'Choose the correct tense: "She ____ to the market yesterday."', 'went', 'go', 'goes', 'going', 'a', 'easy', 'https://source.unsplash.com/800x450/?english,lesson', 10],
        [2, 'Complete: "____ is your name?"', 'What', 'Who', 'When', 'Where', 'a', 'easy', 'https://source.unsplash.com/800x450/?question,mark', 10],
        [3, 'What is the capital of Colombia?', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'a', 'easy', 'https://source.unsplash.com/800x450/?bogota,colombia', 10],
        [3, 'What is Colombia\'s main export product?', 'Coffee', 'Flowers', 'Oil', 'Banana', 'a', 'easy', 'https://source.unsplash.com/800x450/?colombian,coffee', 10]
    ];

    // Crear tablas de forma síncrona y en orden
    const tables = [
        `CREATE TABLE IF NOT EXISTS game_modes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        
        `CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_mode_id INTEGER NOT NULL,
            question_text TEXT NOT NULL,
            option_a TEXT NOT NULL,
            option_b TEXT NOT NULL,
            option_c TEXT NOT NULL,
            option_d TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            image_url TEXT,
            points INTEGER DEFAULT 10,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (game_mode_id) REFERENCES game_modes(id)
        )`,
        
        `CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT NOT NULL,
            game_mode_id INTEGER NOT NULL,
            score INTEGER NOT NULL,
            time_seconds INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (game_mode_id) REFERENCES game_modes(id)
        )`
    ];

    let currentIndex = 0;

    function createNextTable() {
        if (currentIndex >= tables.length) {
            // Todas las tablas creadas, ahora insertar datos
            console.log('✅ All tables created successfully');
            insertInitialData(modes, questions);
            return;
        }

        db.run(tables[currentIndex], function(err) {
            if (err) {
                console.error(`❌ Error creating table ${currentIndex + 1}:`, err);
            } else {
                console.log(`✅ Table ${currentIndex + 1} created/verified`);
                currentIndex++;
                createNextTable();
            }
        });
    }

    createNextTable();
}

function insertInitialData(modes, questions) {
    console.log('📥 Inserting initial data...');
    
    let modesInserted = 0;

    modes.forEach(([name, description]) => {
        db.run(
            'INSERT OR IGNORE INTO game_modes (name, description) VALUES (?, ?)',
            [name, description],
            function(err) {
                if (err) {
                    console.error(`❌ Error inserting mode ${name}:`, err);
                } else {
                    if (this.changes > 0) {
                        console.log(`✅ Mode inserted: ${name}`);
                    } else {
                        console.log(`⚠️ Mode already exists: ${name}`);
                    }
                    modesInserted++;
                    
                    if (modesInserted === modes.length) {
                        // Todos los modos insertados, ahora las preguntas
                        insertQuestions(questions, modes.length);
                    }
                }
            }
        );
    });
}

function insertQuestions(questions, modesCount) {
    console.log('📝 Inserting sample questions...');
    
    let questionsInserted = 0;

    questions.forEach((q, index) => {
        db.run(
            `INSERT OR IGNORE INTO questions 
            (game_mode_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, image_url, points) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            q,
            function(err) {
                if (err) {
                    console.error(`❌ Error inserting question ${index + 1}:`, err);
                } else {
                    if (this.changes > 0) {
                        console.log(`✅ Question ${index + 1} inserted`);
                    }
                    questionsInserted++;
                    
                    if (questionsInserted === questions.length) {
                        console.log('🎉 Database initialization completed!');
                        console.log('📊 Summary:');
                        console.log(`   - Game modes: ${modesCount}`);
                        console.log(`   - Questions: ${questions.length}`);
                    }
                }
            }
        );
    });
}

module.exports = db;
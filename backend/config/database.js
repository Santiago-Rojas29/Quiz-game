const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Usar base de datos en memoria para producción
const dbPath = process.env.NODE_ENV === 'production' 
    ? ':memory:' 
    : path.join(__dirname, '..', 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database:', dbPath);
        initDatabase();
    }
});

function initDatabase() {
    const tables = [
        `CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT NOT NULL,
            game_mode_id INTEGER NOT NULL,
            score INTEGER NOT NULL,
            time_seconds INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    tables.forEach(sql => {
        db.run(sql, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                console.log('Table created/verified');
            }
        });
    });
}

module.exports = db;
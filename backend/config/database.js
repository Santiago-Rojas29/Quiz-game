const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// ✅ BASE DE DATOS PERSISTENTE para producción
const dbPath = process.env.NODE_ENV === 'production' 
    ? '/tmp/quiz_database.sqlite'  // ✅ Render permite /tmp/ persistente
    : path.join(__dirname, '..', 'database.sqlite');

console.log('📁 Database path:', dbPath);

// Asegurar que el directorio existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err);
    } else {
        console.log('✅ Connected to SQLite database:', dbPath);
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
        )`,
        
        `CREATE TABLE IF NOT EXISTS game_modes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    // Insertar modos de juego si no existen
    const modes = [
        ['general-culture', 'General Culture Questions'],
        ['english-grammar', 'English Grammar Questions'],
        ['colombian-culture', 'Colombian Culture Questions']
    ];

    let tablesCreated = 0;
    
    tables.forEach((sql, index) => {
        db.run(sql, (err) => {
            if (err) {
                console.error('❌ Error creating table:', err);
            } else {
                tablesCreated++;
                console.log(`✅ Table ${index + 1} created/verified`);
                
                // Cuando todas las tablas estén creadas, insertar modos
                if (tablesCreated === tables.length) {
                    insertGameModes();
                }
            }
        });
    });

    function insertGameModes() {
        modes.forEach(([name, description]) => {
            db.run(
                'INSERT OR IGNORE INTO game_modes (name, description) VALUES (?, ?)',
                [name, description],
                function(err) {
                    if (err) {
                        console.error(`❌ Error inserting mode ${name}:`, err);
                    } else if (this.changes > 0) {
                        console.log(`✅ Game mode inserted: ${name}`);
                    }
                }
            );
        });
    }
}

module.exports = db;
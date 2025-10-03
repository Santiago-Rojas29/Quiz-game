// ====================================================================================
//                                  LEADERBOARD SYSTEM (API)
// ====================================================================================

// CAMBIA el puerto a 10000
var API_BASE_URL = "https://quiz-game-1k5m.onrender.com";

const MODE_IDS = {
    'general-culture': 1,
    'english-grammar': 2,
    'colombian-culture': 3
};

const MODE_NAMES = {
    'general-culture': 'General Culture',
    'english-grammar': 'English Grammar', 
    'colombian-culture': 'Colombian Culture'
};

async function savePlayerScore(mode, name, pts, time) {
    try {
        const modeId = MODE_IDS[mode];
        const response = await fetch(`${API_BASE_URL}/api/scores/save`, { // AÑADÍ /api
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player_name: name,
                game_mode_id: modeId,
                score: pts,
                time_seconds: time
            })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        if (result.success) {
            console.log('Score saved to database');
            return true;
        } else {
            console.error('Error saving score:', result.error);
            return false;
        }
    } catch (error) {
        console.error('Error saving score to API:', error);
        // Fallback a localStorage
        return saveToLocalStorage(mode, name, pts, time);
    }
}

function saveToLocalStorage(mode, name, pts, time) {
    try {
        const key = `scores_${mode}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        
        existing.push({
            player_name: name,
            score: pts,
            time_seconds: time,
            date: new Date().toISOString()
        });
        
        // Ordenar por score (descendente) y tiempo (ascendente)
        existing.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.time_seconds - b.time_seconds;
        });
        
        // Mantener solo top 10
        const topScores = existing.slice(0, 10);
        localStorage.setItem(key, JSON.stringify(topScores));
        
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}


async function loadScoresByMode(mode) {
    try {
        const modeId = MODE_IDS[mode];
        const response = await fetch(`${API_BASE_URL}/api/scores/mode/${modeId}`);
        
        if (response.ok) {
            const result = await response.json();
            console.log(`📊 Scores loaded for ${mode}:`, result.scores?.length || 0);
            
            // ✅ ORDENAR: Primero por score (desc), luego por tiempo (asc)
            const sortedScores = (result.scores || []).sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.time_seconds - b.time_seconds;
            });
            
            return sortedScores;
        } else {
            console.log(`📊 Using localStorage for ${mode}`);
            // Fallback a localStorage
            const key = `scores_${mode}`;
            const localScores = JSON.parse(localStorage.getItem(key) || '[]');
            console.log(`📊 Local scores for ${mode}:`, localScores.length);
            return localScores;
        }
    } catch (error) {
        console.error('Error loading scores from API:', error);
        console.log(`📊 Fallback to localStorage for ${mode}`);
        // Fallback a localStorage
        const key = `scores_${mode}`;
        const localScores = JSON.parse(localStorage.getItem(key) || '[]');
        return localScores;
    }
}

async function getPlayerRank(mode, playerName, score, time) {
    try {
        const modeId = MODE_IDS[mode] || 1;
        
        // ✅ DEBUG: Ver qué datos se envían
        console.log('📤 Sending rank request:', {
            player_name: playerName,
            game_mode_id: modeId,
            score: score,
            time_seconds: time
        });

        const response = await fetch(`${API_BASE_URL}/api/scores/rank`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player_name: playerName,
                game_mode_id: modeId,
                score: score,
                time_seconds: time
            })
        });
        
        // ✅ DEBUG: Ver respuesta del servidor
        console.log('📥 Server response status:', response.status);
        const responseText = await response.text();
        console.log('📥 Server response:', responseText);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${responseText}`);
        }
        
        const result = JSON.parse(responseText);
        return result.rank || 1;
    } catch (error) {
        console.error('Error getting rank:', error);
        return 1; // Fallback
    }
}

// Función para crear tabs de categorías
function createModeTabs() {
    const scoresList = document.getElementById('global-lb-list');
    if (!scoresList) {
        console.error('❌ global-lb-list element not found!');
        return;
    }
    
    console.log('🔧 Creating mode tabs...');
    
    // Crear tabs
    const tabsHtml = `
        <div class="mode-tabs">
            <button class="tab-btn active" data-mode="general-culture">🌍 General Culture</button>
            <button class="tab-btn" data-mode="english-grammar">🇬🇧 English Grammar</button>
            <button class="tab-btn" data-mode="colombian-culture">🇨🇴 Colombian Culture</button>
        </div>
        <div class="scores-container" id="scores-container"></div>
    `;
    
    scoresList.innerHTML = tabsHtml;
    
    // Agregar event listeners a los tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            console.log(`🎯 Switching to ${mode} leaderboard`);
            
            // Actualizar tabs activos
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Cargar scores para esta categoría
            loadAndDisplayScores(mode);
        });
    });
}

// Función para mostrar scores en container específico
// Función para mostrar scores en container específico
function displayScoresInContainer(scores, container) {
    if (!container) {
        console.error('❌ Scores container not found!');
        return;
    }
    
    console.log(`📊 Displaying ${scores.length} scores`);
    
    if (scores.length === 0) {
        container.innerHTML = '<p class="no-scores">No scores available yet. Be the first!</p>';
        return;
    }
    
    // ✅ NUEVA ESTRUCTURA: Tabla en lugar de divs
    let html = `
        <div class="leaderboard-table">
            <div class="table-header">
                <span class="header-rank">Rank</span>
                <span class="header-player">Player</span>
                <span class="header-score">Score</span>
                <span class="header-time">Time</span>
            </div>
            <div class="table-body">
    `;
    
    // Eliminar duplicados (por si acaso)
    const uniqueScores = removeDuplicateScores(scores);
    
    uniqueScores.forEach((score, index) => {
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
        
        // Destacar top 3
        const rowClass = rank <= 3 ? 'top-three' : '';
        
        html += `
            <div class="score-row ${rowClass}">
                <span class="rank-badge">${medal}</span>
                <span class="player-name">${score.player_name}</span>
                <span class="score-value">${score.score} pts</span>
                <span class="time-value">${formatTime(score.time_seconds)}</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// ✅ NUEVA FUNCIÓN: Eliminar scores duplicados
function removeDuplicateScores(scores) {
    const seen = new Set();
    return scores.filter(score => {
        const key = `${score.player_name}-${score.score}-${score.time_seconds}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}
// Función para cargar y mostrar scores
async function loadAndDisplayScores(mode = 'general-culture') {
    try {
        const scoresContainer = document.getElementById('scores-container');
        if (scoresContainer) {
            scoresContainer.innerHTML = '<p class="loading-text">Loading scores...</p>';
            
            const scores = await loadScoresByMode(mode);
            displayScoresInContainer(scores, scoresContainer);
        } else {
            console.error('❌ scores-container element not found!');
        }
    } catch (error) {
        console.error('Error loading scores:', error);
        const scoresContainer = document.getElementById('scores-container');
        if (scoresContainer) {
            scoresContainer.innerHTML = '<p class="error-text">Error loading scores</p>';
        }
    }
}

// Función renderLeaderboard
function renderLeaderboard() {
    try {
        console.log('📊 Renderizando leaderboard...');
        
        // Actualizar el título
        const titleElement = document.getElementById('ranking-title');
        if (titleElement) {
            titleElement.textContent = `🏆 Global Ranking`;
        }
        
        // Mostrar la vista
        showView('leaderboard-view');
        
        // Crear tabs y cargar scores iniciales
        createModeTabs();
        loadAndDisplayScores('general-culture');
        
    } catch (error) {
        console.error('Error en renderLeaderboard:', error);
        alert('Error loading leaderboard. Please try again.');
    }
}

// Hacer funciones disponibles globalmente
if (typeof window !== 'undefined') {
    window.savePlayerScore = savePlayerScore;
    window.saveToLocalStorage = saveToLocalStorage;
    window.loadAndDisplayScores = loadAndDisplayScores;
    window.renderLeaderboard = renderLeaderboard;
    window.getPlayerRank = getPlayerRank;
}
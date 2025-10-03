// ====================================================================================
//                                  LEADERBOARD SYSTEM (API)
// ====================================================================================

// URL de producción - cambiar por tu URL de Render
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
        console.log('💾 Saving score to database:', { mode, name, pts, time });
        
        const response = await fetch(`${API_BASE_URL}/api/scores/save`, {
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

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        if (result.success) {
            console.log('✅ Score saved to database');
            return true;
        } else {
            console.error('❌ Error saving score:', result.error);
            return false;
        }
    } catch (error) {
        console.error('❌ Error saving score to API:', error);
        // ❌ NO fallback a localStorage
        return false;
    }
}

// Función para cargar scores por categoría - SOLO base de datos
async function loadScoresByMode(mode) {
    try {
        const modeId = MODE_IDS[mode];
        console.log(`📊 Loading scores for ${mode} (modeId: ${modeId})`);
        
        const response = await fetch(`${API_BASE_URL}/api/scores/mode/${modeId}`);
        
        if (response.ok) {
            const result = await response.json();
            console.log(`✅ Scores loaded from API:`, result.scores?.length || 0);
            
            // Ordenar por score (descendente) y tiempo (ascendente)
            const sortedScores = (result.scores || []).sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.time_seconds - b.time_seconds;
            });
            
            return sortedScores;
        } else {
            console.error('❌ API response not OK:', response.status);
            return []; // ❌ NO fallback a localStorage
        }
    } catch (error) {
        console.error('❌ Error loading scores from API:', error);
        return []; // ❌ NO fallback a localStorage
    }
}

async function getPlayerRank(mode, playerName, score, time) {
    try {
        const modeId = MODE_IDS[mode] || 1;
        
        console.log('📤 Getting rank for:', { playerName, score, time });
        
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
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const result = await response.json();
        console.log('✅ Rank received:', result.rank);
        return result.rank || 1;
    } catch (error) {
        console.error('Error getting rank:', error);
        return 1;
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
    
    // ✅ NUEVA ESTRUCTURA: Tabla profesional
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
    
    scores.forEach((score, index) => {
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
    window.loadAndDisplayScores = loadAndDisplayScores;
    window.renderLeaderboard = renderLeaderboard;
    window.getPlayerRank = getPlayerRank;
}
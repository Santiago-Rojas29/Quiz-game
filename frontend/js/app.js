// ====================================================================================
//                                  APP INITIALIZATION
// ====================================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 App starting...');
    
    // Esperar un momento para que todos los scripts carguen
    setTimeout(initializeApp, 100);
});

function initializeApp() {
    console.log('✅ Initializing app...');
    
    // Verificar que todas las funciones críticas estén disponibles
    const requiredFunctions = [
        'showView', 'startQuiz', 'renderLeaderboard', 
        'shuffleArray', 'formatModeName'
    ];
    
    let allFunctionsAvailable = true;
    requiredFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'undefined') {
            console.error(`❌ Missing: ${funcName}`);
            allFunctionsAvailable = false;
        } else {
            console.log(`✅ ${funcName} is available`);
        }
    });
    
    if (!allFunctionsAvailable) {
        console.error('❌ Some functions are missing. Please refresh the page.');
        return;
    }
    
    setupEventListeners();
    showView('start-screen');
    console.log('🎮 App ready!');
}

function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Start button
    const startBtn = document.getElementById('start-quiz-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Si no hay jugador registrado, ir directamente a registro
            if (!gameState.currentPlayer) {
                showView('registration-screen');
            } else {
                showView('mode-selection');
            }
        });
    }
    
    // Registration button - CORREGIDO
    const registerBtn = document.getElementById('register-name-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const playerName = document.getElementById('player-name-input').value.trim();
            if (playerName) {
                gameState.currentPlayer = playerName;
                document.getElementById('name-error').style.display = 'none';
                
                // Guardar en localStorage para persistencia
                localStorage.setItem('quizPlayerName', playerName);
                
                console.log(`👤 Player registered: ${playerName}`);
                showView('mode-selection');
            } else {
                document.getElementById('name-error').style.display = 'block';
            }
        });
    }
    
    // Cargar jugador desde localStorage si existe
    const savedPlayer = localStorage.getItem('quizPlayerName');
    if (savedPlayer) {
        gameState.currentPlayer = savedPlayer;
        console.log(`👤 Loaded player from storage: ${savedPlayer}`);
    }
    
    // Mode selection cards - CORREGIDO
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const mode = this.getAttribute('data-mode');
            console.log(`🎯 Starting ${mode} mode`);
            
            if (!gameState.currentPlayer) {
                showView('registration-screen');
                return;
            }
            
            if (typeof startQuiz === 'function') {
                startQuiz(mode);
            } else {
                alert('Game system not loaded. Please refresh.');
            }
        });
    });
    
    // Leaderboard button
    const leaderboardBtn = document.getElementById('view-ranking-btn');
    if (leaderboardBtn) {
        leaderboardBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📊 Showing leaderboard');
            
            if (typeof renderLeaderboard === 'function') {
                renderLeaderboard();
            } else {
                alert('Leaderboard not available.');
            }
        });
    }
    
    // Navigation buttons
    setupNavigationButtons();
    
    // Game buttons
    setupGameButtons();
    
    console.log('✅ Event listeners setup complete');
}

function setupNavigationButtons() {
    // Back to menu from leaderboard - CORREGIDO
    const backToModesBtn = document.getElementById('back-to-modes-btn');
    if (backToModesBtn) {
        backToModesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showView('mode-selection');
        });
    }
    
    // Logout button - CORREGIDO
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                gameState.currentPlayer = null;
                localStorage.removeItem('quizPlayerName');
                showView('start-screen');
            }
        });
    }
    
    // Help button
    const helpBtn = document.getElementById('view-help-btn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('How to play:\n\n1. Enter your name\n2. Select a category\n3. Answer questions\n4. Check your ranking!');
        });
    }
}

function setupGameButtons() {
    // Next question button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            gameState.currentQIndex++;
            if (gameState.currentQIndex < gameState.currentQuestions.length) {
                renderQuestion();
            } else {
                endGame(); // Juego completado normalmente
            }
        });
    }
    
    // Botón de abandonar
    const quitBtn = document.getElementById('quit-quiz-btn');
    if (quitBtn) {
        quitBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to end the game? Your current progress will be saved.')) {
                endGame(true); // abandoned = true
            }
        });
    }
    
    // ✅ CORREGIDO: Play again button - SIN resetGameState aquí
    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function() {
            // El reset se maneja dentro de endGame()
            showView('mode-selection');
        });
    }
}

// Función para resetear el estado del juego - NUEVA
function completeResetGameState() {
    gameState.currentQuestions = [];
    gameState.currentQIndex = 0;
    gameState.currentScore = 0;
    gameState.timeElapsed = 0;
    gameState.startTime = null;
    gameState.currentMode = null;
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}
// Función para salir al menú principal - NUEVA
function exitToMainMenu() {
    resetGameState();
    showView('mode-selection');
}
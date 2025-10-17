// ====================================================================================
//                                  GAME LOGIC
// ====================================================================================

const DIFFICULTY_CONFIG = {
    easy: { points: 10, time: 30 },
    medium: { points: 20, time: 25 },
    hard: { points: 30, time: 20 }
};

// SOLUCIÓN DEFINITIVA - Verificar si gameState ya existe
if (typeof gameState === 'undefined') {
    var gameState = {
        currentPlayer: null,
        currentMode: null,
        currentQuestions: [],
        currentQIndex: 0,
        currentScore: 0,
        startTime: null,
        timerInterval: null,
        timeElapsed: 0,
        selectedDifficulty: 'easy',
    };
}


// Funciones específicas del juego
function getQuestionCount(mode) {
    const counts = {
        'quick': 5,
        'normal': 10, 
        'marathon': 20
    };
    return counts[mode] || 10;
}

function buildQuestionSet(questions, count) {
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        console.error('buildQuestionSet: No hay preguntas disponibles');
        return [];
    }
    
    if (questions.length < count) {
        console.warn(`Solo hay ${questions.length} preguntas disponibles de ${count} solicitadas`);
        count = questions.length;
    }
    
    const shuffled = shuffleArray(questions);
    return shuffled.slice(0, count);
}

function startQuiz(mode) {
    console.log('Iniciando quiz con modo:', mode);
    
    if (!gameState.currentPlayer) {
        gameState.currentPlayer = "Jugador";
    }
    
    if (!window.questions || window.questions.length === 0) {
        console.error('No hay preguntas cargadas');
        alert('Error: No hay preguntas disponibles.');
        return;
    }
    
    console.log('Preguntas totales disponibles:', window.questions.length);
    
    const questionSet = buildQuestionSet(window.questions, getQuestionCount(mode));
    console.log('Set de preguntas creado:', questionSet.length);
    
    if (questionSet.length === 0) {
        alert('Error: No se pudieron cargar las preguntas.');
        return;
    }
    
    gameState.currentQuestions = questionSet;
    gameState.currentMode = mode;
    gameState.currentQIndex = 0;
    gameState.currentScore = 0;
    gameState.timeElapsed = 0;
    gameState.startTime = null;

    document.getElementById('player-label-quiz').textContent = gameState.currentPlayer;
    document.getElementById('mode-label-quiz').textContent = formatModeName(mode);
    document.getElementById('score-label-quiz').textContent = gameState.currentScore;
    document.getElementById('total-q').textContent = gameState.currentQuestions.length;
    document.getElementById('time-label-quiz').textContent = '00:00';
    document.getElementById('next-btn').disabled = true;
    document.getElementById('feedback-message').textContent = '';

    showView('quiz-screen');
    startCountdown(3, () => {
        gameState.startTime = Date.now();
        startTimer();
        renderQuestion();
    });
}

function startCountdown(seconds, callback) {
    const overlay = document.getElementById('countdown-overlay');
    const numberEl = document.getElementById('countdown-number');
    overlay.style.display = 'flex';

    let current = seconds;
    numberEl.textContent = current;

    const interval = setInterval(() => {
        current--;
        if (current > 0) {
            numberEl.textContent = current;
        } else {
            clearInterval(interval);
            overlay.style.display = 'none';
            callback();
        }
    }, 1000);
}

function startTimer() {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    const timeLabel = document.getElementById('time-label-quiz');

    gameState.timerInterval = setInterval(() => {
        gameState.timeElapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
        timeLabel.textContent = formatTime(gameState.timeElapsed);
    }, 1000);
}

function stopTimer() {
    clearInterval(gameState.timerInterval);
}

function getDifficultyPoints(diff) {
    const configKey = Object.keys(DIFFICULTY_CONFIG).find(key => key === diff);
    return configKey ? DIFFICULTY_CONFIG[configKey].points : 0;
}

function renderQuestion() {
    const item = gameState.currentQuestions[gameState.currentQIndex];
    if (!item) { endGame(); return; }

    document.getElementById('cur-q').textContent = gameState.currentQIndex + 1;
    document.getElementById('q-text').textContent = item.q;
    document.getElementById('q-img').src = item.img;
    document.getElementById('q-img').alt = `Image related to: ${item.q}`;
    document.getElementById('feedback-message').textContent = '';
    document.getElementById('next-btn').disabled = true;
    
    const answersEl = document.getElementById('answers-grid');
    answersEl.innerHTML = '';
    item.opts.forEach((opt, i) => {
        const btn = document.createElement('div');
        btn.className = 'answer';
        btn.textContent = opt;
        btn.onclick = () => selectAnswer(i, btn, item);
        answersEl.appendChild(btn);
    });
}

function selectAnswer(i, btn, item) {
    document.querySelectorAll('.answer').forEach(a => a.onclick = null);

    const points = getDifficultyPoints(item.diff);
    
    if (i === item.a) {
        btn.classList.add('correct');
        gameState.currentScore += points;
        document.getElementById('feedback-message').innerHTML = `Correct! <span style="color:var(--success-color)">+${points} points.</span>`;
    } else {
        btn.classList.add('wrong');
        const correctEl = Array.from(document.querySelectorAll('.answer'))[item.a];
        if (correctEl) correctEl.classList.add('correct');
        document.getElementById('feedback-message').innerHTML = `Incorrect. The correct answer was: <strong>${item.opts[item.a]}</strong>.`;
    }

    document.getElementById('score-label-quiz').textContent = gameState.currentScore;
    document.getElementById('next-btn').disabled = false;
}

async function endGame(abandoned = false) {
    stopTimer();

    const modeKey = gameState.currentMode;
    const currentScore = gameState.currentScore;
    const currentTime = gameState.timeElapsed;
    const modeName = formatModeName(modeKey);

    const messageEl = document.getElementById('result-message');
    
    // ✅ CORREGIDO: Lógica mejorada para mensajes
    if (abandoned) {
        messageEl.textContent = 'Game Abandoned';
    } else {
        const maxPossibleScore = calculateMaxPossibleScore();
        const scorePercentage = (currentScore / maxPossibleScore) * 100;
        
        if (scorePercentage >= 90) {
            messageEl.textContent = 'Absolute Dominance! 🥇';
        } else if (scorePercentage >= 70) {
            messageEl.textContent = 'Excellent Work! 🎯';
        } else if (scorePercentage >= 50) {
            messageEl.textContent = 'Good Effort! 💪';
        } else if (scorePercentage > 0) {
            messageEl.textContent = 'Keep Practicing! 📚';
        } else {
            messageEl.textContent = 'You need practice. Keep trying. 😅';
        }
    }

    document.getElementById('final-mode-label').textContent = modeName;
    document.getElementById('final-score-label').textContent = currentScore;
    document.getElementById('final-time-label').textContent = formatTime(currentTime);

    try {
        const finalRank = await getPlayerRank(modeKey, gameState.currentPlayer, currentScore, currentTime);
        document.getElementById('final-rank-label').textContent = `#${finalRank}`;
    } catch (error) {
        console.error('Error getting rank:', error);
        document.getElementById('final-rank-label').textContent = 'N/A';
    }

    showView('game-over-screen');
    
    // ✅ CORREGIDO: Configurar botón de guardar score para partidas abandonadas también
    const saveScoreBtn = document.getElementById('save-score-btn');
    if (saveScoreBtn) {
        // ✅ PERMITIR guardar incluso en partidas abandonadas (si hay puntaje)
        if (abandoned && currentScore === 0) {
            saveScoreBtn.disabled = true;
            saveScoreBtn.textContent = 'No Score to Save';
        } else {
            saveScoreBtn.disabled = false;
            saveScoreBtn.textContent = 'Save Score';
            
            // ✅ PREVENIR MÚLTIPLES CLICS
            saveScoreBtn.replaceWith(saveScoreBtn.cloneNode(true));
            const newSaveBtn = document.getElementById('save-score-btn');
            
            newSaveBtn.onclick = async function() {
                if (typeof savePlayerScore === 'function') {
                    // ✅ DESHABILITAR BOTÓN INMEDIATAMENTE
                    this.disabled = true;
                    this.textContent = 'Saving...';
                    
                    try {
                        const success = await savePlayerScore(
                            gameState.currentMode,
                            gameState.currentPlayer,
                            gameState.currentScore,
                            gameState.timeElapsed
                        );
                        
                        if (success) {
                            this.textContent = 'Score Saved! ✅';
                            console.log('✅ Score saved successfully');
                            
                            // ✅ ACTUALIZAR RANKING INMEDIATAMENTE después de guardar
                            setTimeout(() => {
                                if (typeof getPlayerRank === 'function') {
                                    getPlayerRank(modeKey, gameState.currentPlayer, currentScore, currentTime)
                                        .then(newRank => {
                                            document.getElementById('final-rank-label').textContent = `#${newRank}`;
                                        });
                                }
                            }, 500);
                            
                        } else {
                            this.textContent = 'Save Score';
                            this.disabled = false;
                            alert('Error saving score. Please try again.');
                        }
                    } catch (error) {
                        console.error('Error in save button:', error);
                        this.textContent = 'Save Score';
                        this.disabled = false;
                    }
                }
            };
        }
    }
    
    // Configurar botón "Back to Modes"
const playAgainBtn = document.getElementById('play-again-btn');
if (playAgainBtn) {
    playAgainBtn.textContent = 'Back to Modes';
    playAgainBtn.onclick = function() {
        // ✅ RESET SIMPLE - siempre funciona
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
        showView('mode-selection');
    };
}
// AÑADIR ESTA FUNCIÓN PARA CALCULAR PUNTAJE MÁXIMO
function calculateMaxPossibleScore() {
    let maxScore = 0;
    gameState.currentQuestions.forEach(question => {
        const points = getDifficultyPoints(question.diff);
        maxScore += points;
    });
    return maxScore;
}
if (typeof window !== 'undefined') {
    window.startQuiz = startQuiz;
    window.renderQuestion = renderQuestion;
    window.endGame = endGame;
    window.getQuestionCount = getQuestionCount;
}
// ====================================================================================
//                                  GAME STATE MANAGEMENT
// ====================================================================================

// ✅ FUNCIÓN: Reset parcial del estado del juego
function resetGameState() {
    console.log('🔄 Resetting game state (partial)...');
    // NO resetear el currentMode y currentPlayer para permitir guardar score
    gameState.currentQuestions = [];
    gameState.currentQIndex = 0;
    // Mantener el score y tiempo hasta que se guarde explícitamente
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// ✅ FUNCIÓN: Reset completo del estado del juego
function completeResetGameState() {
    console.log('🔄 Resetting game state (complete)...');
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

// ✅ FUNCIÓN: Calcular puntaje máximo posible
function calculateMaxPossibleScore() {
    let maxScore = 0;
    if (gameState.currentQuestions && gameState.currentQuestions.length > 0) {
        gameState.currentQuestions.forEach(question => {
            const points = getDifficultyPoints(question.diff);
            maxScore += points;
        });
    }
    return maxScore;
}

// ✅ Hacer funciones disponibles globalmente
if (typeof window !== 'undefined') {
    window.startQuiz = startQuiz;
    window.renderQuestion = renderQuestion;
    window.endGame = endGame;
    window.getQuestionCount = getQuestionCount;
    window.resetGameState = resetGameState;
    window.completeResetGameState = completeResetGameState;
    window.calculateMaxPossibleScore = calculateMaxPossibleScore;
}}




// boton de de reglas y del video explicativo 



const helpBtn = document.getElementById('helpBtn');
const helpPanel = document.getElementById('helpPanel');
const closeHelp = document.getElementById('closeHelp');

helpBtn.addEventListener('click', () => {
  helpPanel.classList.toggle('active');
});

closeHelp.addEventListener('click', () => {
  helpPanel.classList.remove('active');
});

// Cerrar si se hace clic fuera del panel
document.addEventListener('click', (e) => {
  if (!helpPanel.contains(e.target) && !helpBtn.contains(e.target)) {
    helpPanel.classList.remove('active');
  }
});



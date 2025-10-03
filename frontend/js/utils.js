// ====================================================================================
//                                  UTILITIES
// ====================================================================================
function shuffleArray(array) {
    // Agrega validación
    if (!array || !Array.isArray(array)) {
        console.error('shuffleArray: Array inválido', array);
        return [];
    }
    
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function randomizeAnswers(questionSet) {
    for (const mode in questionSet) {
        questionSet[mode].forEach(q => {
            const originalOpts = [...q.opts];
            const originalCorrectAnswer = originalOpts[q.a];
            
            shuffleArray(q.opts);
            q.a = q.opts.findIndex(opt => opt === originalCorrectAnswer);

            if (q.a === -1) {
                console.error("Error shuffling question options", q);
                q.a = 0;
            }
        });
    }
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatModeName(key) {
    const names = {
        'quick': 'Quick Play',
        'normal': 'Normal Mode', 
        'marathon': 'Marathon Mode',
        'general-culture': 'General Culture',
        'english-grammar': 'English Grammar',
        'colombian-culture': 'Colombian Culture'
    };
    return names[key] || 'Unknown Mode';
}

// Sistema de vistas - ESTA ES LA IMPORTANTE
const views = document.querySelectorAll('.view');
function showView(id) {
    console.log('Mostrando vista:', id);
    views.forEach(v => {
        v.style.display = 'none';
        v.classList.remove('active');
    });
    const targetView = document.getElementById(id);
    if (targetView) {
        targetView.style.display = 'block';
        targetView.classList.add('active');
    } else {
        console.error('Vista no encontrada:', id);
    }
}

// Hacer funciones disponibles globalmente
window.shuffleArray = shuffleArray;
window.formatTime = formatTime;
window.formatModeName = formatModeName;
window.showView = showView;
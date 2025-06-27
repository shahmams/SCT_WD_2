// DOM Elements
const display = document.getElementById('display');
const mainBtn = document.getElementById('mainBtn');
const sideBtn = document.getElementById('sideBtn');
const lapsContainer = document.getElementById('lapsContainer');
const themeToggle = document.getElementById('themeToggle');
const stopwatchCard = document.querySelector('.stopwatch-card');

// Stopwatch variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let isPaused = false;
let laps = [];

// Format time as HH:MM:SS.MS
function formatTime(timeInMillis) {
    const date = new Date(timeInMillis);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

// Update the display
function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
}

// Start the stopwatch
function startStopwatch() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay();
    }, 10);
    isRunning = true;
    isPaused = false;
    stopwatchCard.classList.add('running');
    updateButtons();
}

// Pause the stopwatch
function pauseStopwatch() {
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = true;
    stopwatchCard.classList.remove('running');
    updateButtons();
}

// Resume the stopwatch
function resumeStopwatch() {
    startStopwatch();
}

// Reset the stopwatch
function resetStopwatch() {
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = false;
    elapsedTime = 0;
    laps = [];
    stopwatchCard.classList.remove('running');
    updateDisplay();
    renderLaps();
    updateButtons();
}

// Record a lap
function recordLap() {
    const lapTime = elapsedTime;
    const previousLapTime = laps.length > 0 ? laps[laps.length - 1].overall : 0;
    const lapDifference = lapTime - previousLapTime;
    laps.push({
        number: laps.length + 1,
        lap: lapDifference,
        overall: lapTime
    });
    renderLaps();
}

// Render laps to the UI
function renderLaps() {
    const lapCount = document.querySelector('.lap-count');
    lapCount.textContent = laps.length;
    
    if (laps.length === 0) {
        lapsContainer.innerHTML = `
            <div class="laps-header">
                <h3><i class="fas fa-flag-checkered"></i> Laps</h3>
                <span class="lap-count">0</span>
            </div>
            <div class="no-laps">
                <i class="fas fa-stopwatch"></i>
                <p>No laps recorded yet</p>
            </div>
        `;
        return;
    }
    let lapsHTML = `
        <div class="laps-header">
            <h3><i class="fas fa-flag-checkered"></i> Laps</h3>
            <span class="lap-count">${laps.length}</span>
        </div>
        <div class="lap-table">
            <div class="lap-row lap-header">
                <span><i class="fas fa-hashtag"></i> Lap</span>
                <span><i class="fas fa-clock"></i> Time</span>
                <span><i class="fas fa-list-ol"></i> Overall</span>
            </div>
    `;
    laps.slice().reverse().forEach(lap => {
        lapsHTML += `
            <div class="lap-row">
                <span>${lap.number}</span>
                <span>${formatTime(lap.lap)}</span>
                <span>${formatTime(lap.overall)}</span>
            </div>
        `;
    });
    lapsHTML += `</div>`;
    lapsContainer.innerHTML = lapsHTML;
    lapsContainer.scrollTop = 0;
}

// Toggle dark/light mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkMode', isDark);
}

// Update button states and labels
function updateButtons() {
    if (!isRunning && !isPaused) {
        mainBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        sideBtn.innerHTML = '<i class="fas fa-redo"></i> Reset';
        sideBtn.disabled = laps.length === 0 && elapsedTime === 0;
        mainBtn.disabled = false;
    } else if (isRunning) {
        mainBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
        sideBtn.innerHTML = '<i class="fas fa-flag"></i> Lap';
        sideBtn.disabled = false;
        mainBtn.disabled = false;
    } else if (isPaused) {
        mainBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        sideBtn.innerHTML = '<i class="fas fa-redo"></i> Reset';
        sideBtn.disabled = false;
        mainBtn.disabled = false;
    }
}

// Event listeners
mainBtn.addEventListener('click', function() {
    if (!isRunning && !isPaused) {
        startStopwatch();
    } else if (isRunning) {
        pauseStopwatch();
    } else if (isPaused) {
        resumeStopwatch();
    }
});
sideBtn.addEventListener('click', function() {
    if (isRunning) {
        recordLap();
    } else {
        resetStopwatch();
    }
});
themeToggle.addEventListener('click', toggleTheme);

// Keyboard shortcuts (optional, can be removed)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!isRunning && !isPaused) {
            startStopwatch();
        } else if (isRunning) {
            pauseStopwatch();
        } else if (isPaused) {
            resumeStopwatch();
        }
    } else if (e.code === 'KeyL' && isRunning) {
        recordLap();
    } else if (e.code === 'KeyR' && (!isRunning || isPaused)) {
        resetStopwatch();
    }
});

// Initialize theme from localStorage
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Initialize stopwatch
resetStopwatch();
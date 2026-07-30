import { pauseIcon, playIcon } from "./icons.js";
import { showTimerEndNotification } from "./notifications.js";
import { resetTabTitle, isPageFocused } from "./utils.js";

const timeRemaining = document.getElementById("time-remaining");
const modeDescription = document.getElementById("mode-description");
const resetButton = document.getElementById("reset-button");
const playPauseButton = document.getElementById("play-pause-button");
const skipButton = document.getElementById("skip-button");
const sessionCounterElement = document.getElementById("session-counter");

const timerEndAudio = new Audio("../assets/sounds/timer-end.mp3");

const SESSION_DURATIONS = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

const SESSION_LABEL = {
    focus: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
};

const SESSION_NOTIFICATION_BODY_MESSAGE = {
    focus: "Back to work! Start your next Pomodoro.",
    shortBreak: "Great work! Time for a break.",
    longBreak: "Break time! You've earned it.",
}

const MAX_NOTIFICATION_REPEATS = 5;
const REPEAT_INTERVAL_MS = 1550; 

let soundIntervalId;
let repeatCount = 0;

let currentSession = "focus";
let sessionCount = 0;
let endTime;
let totalSeconds = SESSION_DURATIONS[currentSession];
let remainingWhenPaused = totalSeconds;
let intervalId;

let isRunning = false;

export function initPomodoro() {
    resetButton.addEventListener("click", resetTimer);
    playPauseButton.addEventListener("click", togglePlayPause);
    skipButton.addEventListener("click", skipTimer);
}

function togglePlayPause() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
    
    isRunning = !isRunning;
    updatePlayPauseIcon();
}

function startTimer() {
    endTime = Date.now() + remainingWhenPaused * 1000;

    intervalId = setInterval(tick, 250);

    tick();
}

function tick() {
    const secondsLeft = isRunning
        ? Math.max(0, Math.round((endTime - Date.now()) / 1000))
        : remainingWhenPaused;

    updateDisplay(secondsLeft);
    updateTabTitle(secondsLeft);

    if (isRunning && secondsLeft <= 0) {
        clearInterval(intervalId);
        isRunning = false;
        updatePlayPauseIcon();
        onSessionComplete();
    }

    shouldDisableResetButton();
}

function pauseTimer() {
    clearInterval(intervalId);
    remainingWhenPaused = Math.max(0, Math.round((endTime - Date.now()) / 1000));
}

function stopTimer() {
    clearInterval(intervalId);
    isRunning = false;
    updatePlayPauseIcon();
}

function resetTimer() {
    stopTimer();
    remainingWhenPaused = totalSeconds;
    tick();
    resetTabTitle();
}

function updateSessionCounterDisplay() {
    sessionCounterElement.textContent = `${sessionCount + 1}/4`;
}

function resetSessionCount() {
    sessionCount = 0;
}

function advanceToNextSession() {
    if (currentSession === "longBreak") {
        resetSessionCount();
    }

    if (currentSession === "focus") {
        sessionCount++;
        currentSession = sessionCount % 4 === 0 ? "longBreak" : "shortBreak";
    } else {
        currentSession = "focus";
        updateSessionCounterDisplay();
    }

    totalSeconds = SESSION_DURATIONS[currentSession];
    remainingWhenPaused = totalSeconds;
    updateModeLabel(currentSession);
}

function skipTimer() {
    stopTimer();
    advanceToNextSession();
    tick();
    resetTabTitle();
}

function getTimeRemaining(secondsLeft) {
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const seconds = String(secondsLeft % 60).padStart(2, "0");

    return `${minutes}:${seconds}`;
}

function updateDisplay(secondsLeft) {
    timeRemaining.textContent = getTimeRemaining(secondsLeft);
}

function updateTabTitle(secondsLeft) {
    document.title = getTimeRemaining(secondsLeft) + " " + SESSION_LABEL[currentSession] +  " | pomo.do";
}

function onSessionComplete() {
    advanceToNextSession();
    isPageFocused() ? playSoundUntilFocused() : showTimerEndNotification(SESSION_NOTIFICATION_BODY_MESSAGE[currentSession]);

    tick();
}

function updateModeLabel(currentSession) {
    modeDescription.textContent = SESSION_LABEL[currentSession];
}

function updatePlayPauseIcon() {
    playPauseButton.innerHTML = isRunning ? pauseIcon : playIcon;
}

function shouldDisableResetButton() {
    resetButton.disabled = !isRunning;
}

function playSoundUntilFocused() {
    repeatCount = 0;

    playSound();

    if(isPageFocused()) return;

    soundIntervalId = setInterval(() => {
        repeatCount++;

        if(isPageFocused() || repeatCount >= MAX_NOTIFICATION_REPEATS) {
            stopSoundLoop();
            return;
        }

        playSound();
    }, REPEAT_INTERVAL_MS);
}

async function playSound() {
    try {
        await timerEndAudio.play();
    } catch (error) {
        console.log("Failed to play alarm.")
    }
}

function stopSoundLoop() {
    clearInterval(soundIntervalId);
    soundIntervalId = null;
}

// Digital Clock Functionality (24-hour format)
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Format the time display (e.g., 12:05 for hours and minutes)
    document.getElementById('time').textContent = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
    document.getElementById('sec').textContent = String(seconds).padStart(2, '0');

    setTimeout(updateClock, 1000);
}

// Alarm Functionality
let alarmTime = null;
let alarmTimeout = null;
let snoozeTimeout = null;
let selectedRingtone = null;

const ringtones = {
    ringtone1: new Audio('ringtone/ringtone1.mp3'),
    ringtone2: new Audio('ringtone/ringtone2.mp3'),
    ringtone3: new Audio('ringtone/ringtone3.mp3'),
};

// Set Alarm
document.getElementById('setAlarmBtn').addEventListener('click', () => {
    const timeInput = document.getElementById('alarmTime').value;
    selectedRingtone = document.getElementById('alarmRingtone').value;

    if (!timeInput) {
        alert('Please select a valid time for the alarm.');
        return;
    }

    const now = new Date();
    const alarmDate = new Date(now.toDateString() + ' ' + timeInput);

    if (alarmDate < now) {
        alert('The selected time has already passed.');
        return;
    }

    alarmTime = alarmDate;

    const timeToAlarm = alarmDate - now;
    const minutesToAlarm = Math.floor(timeToAlarm / 60000);
    const secondsToAlarm = Math.floor((timeToAlarm % 60000) / 1000);

    alert(`Alarm set for ${alarmDate.toLocaleTimeString('en-GB')}\nTime until alarm: ${minutesToAlarm} minutes and ${secondsToAlarm} seconds.`);

    if (alarmTimeout) clearTimeout(alarmTimeout);

    alarmTimeout = setTimeout(triggerAlarm, timeToAlarm);

    document.getElementById('alarmModal').style.display = 'none';
});

// Trigger Alarm
function triggerAlarm() {
    playRingtone();
    document.getElementById('ringingModal').style.display = 'block';
}

// Play Selected Ringtone
function playRingtone() {
    if (ringtones[selectedRingtone]) {
        ringtones[selectedRingtone].loop = true;
        ringtones[selectedRingtone].play();
    }
}

// Stop Alarm
document.getElementById('stopAlarmBtn').addEventListener('click', () => {
    stopRingtone();
    clearTimeout(snoozeTimeout);
    alarmTime = null;
    document.getElementById('ringingModal').style.display = 'none';
});

// Snooze Alarm
document.getElementById('snoozeAlarmBtn').addEventListener('click', () => {
    stopRingtone();
    clearTimeout(snoozeTimeout);

    const snoozeDuration = 5 * 60 * 1000; // 5 minutes
    alarmTime = new Date(new Date().getTime() + snoozeDuration);

    const snoozeMinutes = Math.floor(snoozeDuration / 60000);
    alert(`Alarm snoozed for ${snoozeMinutes} minutes.`);

    snoozeTimeout = setTimeout(triggerAlarm, snoozeDuration);
    document.getElementById('ringingModal').style.display = 'none';
});

// Stop Ringtone
function stopRingtone() {
    if (ringtones[selectedRingtone]) {
        ringtones[selectedRingtone].pause();
        ringtones[selectedRingtone].currentTime = 0;
    }
}

// Timer Functionality
let timerInterval = null;

document.getElementById('startTimerBtn').addEventListener('click', () => {
    const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
    const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
    let totalSeconds = minutes * 60 + seconds;

    if (totalSeconds <= 0) {
        alert('Please set a valid timer.');
        return;
    }

    document.getElementById('timerStatus').textContent = `Timer started for ${minutes}m ${seconds}s`;

    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            alert('Timer ended!');
            document.getElementById('timerStatus').textContent = '';
        } else {
            totalSeconds--;
            const displayMinutes = Math.floor(totalSeconds / 60);
            const displaySeconds = totalSeconds % 60;
            document.getElementById('timerStatus').textContent = `Time left: ${displayMinutes}m ${displaySeconds}s`;
        }
    }, 1000);
});

// Stopwatch Functionality
let stopwatchInterval;
let stopwatchTime = 0;

function formatStopwatchTime(time) {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

document.getElementById('startStopwatchBtn').addEventListener('click', () => {
    if (!stopwatchInterval) {
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            document.getElementById('stopwatchDisplay').textContent = formatStopwatchTime(stopwatchTime);
        }, 1000);
    }
});

document.getElementById('stopStopwatchBtn').addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
});

document.getElementById('resetStopwatchBtn').addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchTime = 0;
    document.getElementById('stopwatchDisplay').textContent = '00:00:00';
});

// Modal Controls
document.querySelectorAll('.closeBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal');
        document.getElementById(modalId).style.display = 'none';
    });
});

document.getElementById('openAlarmBtn').addEventListener('click', () => {
    document.getElementById('alarmModal').style.display = 'block';
});

document.getElementById('openTimerBtn').addEventListener('click', () => {
    document.getElementById('timerModal').style.display = 'block';
});

document.getElementById('openStopwatchBtn').addEventListener('click', () => {
    document.getElementById('stopwatchModal').style.display = 'block';
});

// Initialize Clock
updateClock();

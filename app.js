const capabilityStatus = document.getElementById('support-status');
const voiceStatus = document.getElementById('voice-status');
const locationStatus = document.getElementById('location-status');
const routeStatus = document.getElementById('route-status');

const buttonIds = {
    startVoice: document.getElementById('start-voice'),
    speakSummary: document.getElementById('speak-summary'),
    getLocation: document.getElementById('get-location'),
    announceRoute: document.getElementById('announce-route'),
    vibrateAlert: document.getElementById('vibrate-alert')
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SPEECH_RATE = 1;
const SPEECH_PITCH = 1;
const EARTH_RADIUS_KM = 6371;
const GEOLOCATION_TIMEOUT_MS = 10000;
const GEOLOCATION_MAX_AGE_MS = 60000;
const supportsSpeech = typeof window.speechSynthesis !== 'undefined';
const supportsRecognition = typeof SpeechRecognition !== 'undefined';
const supportsGeolocation = typeof navigator.geolocation !== 'undefined';
const supportsVibration = typeof navigator.vibrate === 'function';

const chicagoLandmarks = [
    { name: 'State and Madison', lat: 41.8820, lng: -87.6278 },
    { name: 'Millennium Park', lat: 41.8827, lng: -87.6226 },
    { name: 'Navy Pier', lat: 41.8917, lng: -87.6078 },
    { name: 'Michigan Avenue Bridge', lat: 41.8881, lng: -87.6247 }
];

function setText(element, message) {
    if (element) {
        element.textContent = message;
    }
}

function updateCapabilities() {
    const capabilities = [
        supportsRecognition ? 'voice recognition' : 'no voice recognition',
        supportsSpeech ? 'speech synthesis' : 'no speech synthesis',
        supportsGeolocation ? 'GPS' : 'no GPS',
        supportsVibration ? 'haptic feedback' : 'no haptics'
    ];

    if (capabilityStatus) {
        capabilityStatus.textContent = capabilities.join(' · ');
        capabilityStatus.classList.toggle('online', supportsSpeech || supportsRecognition || supportsGeolocation);
    }
}

function speak(message) {
    if (!supportsSpeech) {
        setText(voiceStatus, 'Speech synthesis is not supported in this browser.');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = SPEECH_RATE;
    utterance.pitch = SPEECH_PITCH;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setText(voiceStatus, `Speaking: ${message}`);
}

function vibratePattern(pattern, statusMessage) {
    if (!supportsVibration) {
        setText(routeStatus, 'Haptic feedback is not supported on this device.');
        return;
    }

    navigator.vibrate(pattern);
    setText(routeStatus, statusMessage);
}

function toRadians(value) {
    return (value * Math.PI) / 180;
}

function findNearestLandmark(lat, lng) {
    return chicagoLandmarks
        .map((landmark) => {
            const dLat = toRadians(landmark.lat - lat);
            const dLng = toRadians(landmark.lng - lng);
            const haversineTerm = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat)) * Math.cos(toRadians(landmark.lat)) * Math.sin(dLng / 2) ** 2;
            const distanceKm = 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(haversineTerm), Math.sqrt(1 - haversineTerm));
            return { ...landmark, distanceKm };
        })
        .sort((landmarkA, landmarkB) => landmarkA.distanceKm - landmarkB.distanceKm)[0];
}

function announceRoute() {
    const routeMessage = 'Chicago pilot route: proceed toward the nearest marked crosswalk, keep right on the sidewalk, and prepare for a vibration alert before the next intersection.';
    setText(routeStatus, routeMessage);
    speak(routeMessage);
    vibratePattern([150, 100, 150, 100, 250], 'Haptic route alert sent for the next intersection cue.');
}

function openModule(moduleName) {
    const message = `${moduleName} is highlighted in the workstation overview. Use the dashboard cards to continue exploring ${moduleName}.`;
    setText(routeStatus, message);
    speak(message);
}

function processVoiceCommand(transcript) {
    const normalized = transcript.toLowerCase();
    setText(voiceStatus, `Heard: ${transcript}`);

    if (normalized.includes('where am i')) {
        requestLocation();
        return;
    }

    if (normalized.includes('nearest crosswalk') || normalized.includes('start navigation')) {
        announceRoute();
        return;
    }

    if (normalized.includes('financial os')) {
        openModule('Financial OS');
        return;
    }

    if (normalized.includes('creator os')) {
        openModule('Creator OS');
        return;
    }

    if (normalized.includes('learning os')) {
        openModule('Learning OS');
        return;
    }

    if (normalized.includes('research os')) {
        openModule('Research OS');
        return;
    }

    if (normalized.includes('stop navigation')) {
        const message = 'Navigation guidance paused. Use announce Chicago route to resume.';
        setText(routeStatus, message);
        speak(message);
        return;
    }

    const fallback = 'Command recognized, but no mapped action was found. Try saying start navigation, where am I, or Financial OS.';
    setText(routeStatus, fallback);
    speak(fallback);
}

function requestLocation() {
    if (!supportsGeolocation) {
        setText(locationStatus, 'Geolocation is not supported in this browser.');
        return;
    }

    setText(locationStatus, 'Requesting location permission…');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const landmark = findNearestLandmark(latitude, longitude);
            const message = `Current location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}. Nearest Chicago landmark: ${landmark.name}, about ${landmark.distanceKm.toFixed(2)} kilometers away.`;
            setText(locationStatus, message);
            speak(message);
        },
        (error) => {
            const geolocationErrors = {
                1: 'Location permission was denied. Enable GPS access to receive Chicago landmark guidance.',
                2: 'Location data is unavailable right now. You can still use the voice and haptic demo controls.',
                3: 'Location request timed out. Try again in an open area or with a stronger signal.'
            };
            const fallback = geolocationErrors[error.code] || 'Location access was unavailable. For the Chicago pilot, voice prompts remain available without GPS.';
            setText(locationStatus, fallback);
        },
        {
            enableHighAccuracy: true,
            timeout: GEOLOCATION_TIMEOUT_MS,
            maximumAge: GEOLOCATION_MAX_AGE_MS
        }
    );
}

function startVoiceRecognition() {
    if (!supportsRecognition) {
        setText(voiceStatus, 'Voice recognition is not supported in this browser.');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        setText(voiceStatus, 'Voice listener started. Speak a supported command.');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        processVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
        const voiceErrors = {
            'no-speech': 'No speech was detected. Please try the command again.',
            'not-allowed': 'Microphone access was blocked. Enable it to use the voice listener.',
            network: 'The voice listener encountered a network issue. Please retry in a moment.'
        };
        const message = voiceErrors[event.error] || 'Voice recognition could not complete. Please try again.';
        setText(voiceStatus, message);
    };

    recognition.start();
}

function bindControls() {
    if (buttonIds.startVoice) {
        buttonIds.startVoice.addEventListener('click', startVoiceRecognition);
    }

    if (buttonIds.speakSummary) {
        buttonIds.speakSummary.addEventListener('click', () => {
            speak('Welcome to the SSGPT6 Universal Quantum AI Automation Platform. Trading, operations, learning, research, and accessible navigation are available in this dashboard MVP.');
        });
    }

    if (buttonIds.getLocation) {
        buttonIds.getLocation.addEventListener('click', requestLocation);
    }

    if (buttonIds.announceRoute) {
        buttonIds.announceRoute.addEventListener('click', announceRoute);
    }

    if (buttonIds.vibrateAlert) {
        buttonIds.vibrateAlert.addEventListener('click', () => {
            vibratePattern([100, 60, 100, 60, 220], 'Haptic caution pattern sent for an approaching intersection.');
        });
    }
}

function initializeDashboard() {
    updateCapabilities();
    bindControls();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
    initializeDashboard();
}

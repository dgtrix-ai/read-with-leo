let happiness = 50;
let energy = 100;
const puppy = document.querySelector('.puppy-image');
const happinessFill = document.querySelector('.happiness-fill');
const happinessValue = document.querySelector('.happiness-value');
const energyValue = document.querySelector('.energy-value');
const interactionItems = document.querySelector('.interaction-items');

// Words for the spelling game
const words = ['puppy', 'play', 'happy', 'friend', 'love', 'bark', 'fetch', 'treat', 'walk', 'good'];
let currentWord = '';

// Speech recognition setup
let recognition = null;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
}

// Initialize game elements
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    updateWord();
});

function initializeGame() {
    document.querySelectorAll('.interaction-item').forEach(item => {
        item.addEventListener('click', interactWithLeo);
    });
    
    setupSpeechRecognition();
    setupEventListeners();
}

function updateStats() {
    happiness = Math.min(100, Math.max(0, happiness));
    energy = Math.min(100, Math.max(0, energy));
    
    happinessFill.style.width = `${happiness}%`;
    happinessValue.textContent = `${Math.round(happiness)}%`;
    energyValue.textContent = `${Math.round(energy)}%`;
}

function createParticles(x, y, type) {
    const particles = {
        'pet': ['💖', '✨', '💫'],
        'play': ['🎾', '⚡', '🌟'],
        'treat': ['🦴', '❤️', '🍖']
    };
    
    const emojis = particles[type] || particles.pet;
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.left = `${x + (Math.random() - 0.5) * 100}px`;
        particle.style.top = `${y + (Math.random() - 0.5) * 100}px`;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1500);
    }
}

// Continue with all other JavaScript functions from the original file

/**
 * ParticleEffects - A utility class for creating interactive particle animations
 * Creates fun emoji-based particle effects for different interactions
 */
class ParticleEffects {
    /**
     * Creates particle effects at the specified coordinates
     * @param {number} x - X coordinate for the center of the effect
     * @param {number} y - Y coordinate for the center of the effect
     * @param {string} type - Type of effect ('pet', 'play', 'treat', 'mic', 'correct', 'reviewStar')
     */
    static createParticles(x, y, type) {
        const particles = {
            'pet': ['💖', '✨', '💫'],
            'play': ['🎾', '⚡', '🌟'],
            'treat': ['🦴', '❤️', '🍖'],
            'mic': ['🎤', '🔊', '👂', '🗣️'],
            'correct': ['🎉', '⭐', '🌟', '👏', '🎊'],
            'reviewStar': ['⭐', '✨', '💫', '🌠']
        };
        
        const emojis = particles[type] || particles.pet;
        const count = type === 'correct' ? 12 : 6;
        
        for (let i = 0; i < count; i++) {
            this.createSingleParticle(x, y, emojis, type);
        }
    }
    
    /**
     * Creates a single particle element
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {Array} emojis - List of possible emojis to use
     * @param {string} type - Type of particle effect
     */
    static createSingleParticle(x, y, emojis, type) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Different behavior for different particle types
        if (type === 'mic') {
            // Mic particles move in a circular pattern
            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            particle.style.left = `${x + Math.cos(angle) * distance}px`;
            particle.style.top = `${y + Math.sin(angle) * distance}px`;
            particle.style.fontSize = '1.2rem';
        } else if (type === 'correct') {
            // Celebration particles cover more area
            particle.style.left = `${x + (Math.random() - 0.5) * 200}px`;
            particle.style.top = `${y + (Math.random() - 0.5) * 200}px`;
            particle.style.fontSize = '1.8rem';
        } else {
            // Standard particles
            particle.style.left = `${x + (Math.random() - 0.5) * 100}px`;
            particle.style.top = `${y + (Math.random() - 0.5) * 100}px`;
            particle.style.fontSize = '1.5rem';
        }
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1500);
    }
    
    /**
     * Creates particles around an element
     * @param {Element} element - DOM element to create particles around
     * @param {string} type - Type of particle effect
     */
    static createParticlesAroundElement(element, type) {
        const rect = element.getBoundingClientRect();
        this.createParticles(
            rect.left + rect.width/2,
            rect.top + rect.height/2,
            type
        );
    }
}
/**
 * SpeechHelper - A utility class for speech recognition and text-to-speech
 * Makes working with speech recognition easier and more consistent
 */
class SpeechHelper {
    /**
     * Constructor initializes speech recognition
     * @param {object} options - Configuration options
     * @param {Element} options.micButton - Microphone button element
     * @param {Element} options.statusElement - Element to display status messages
     * @param {function} options.onResult - Callback for speech results
     */
    constructor(options) {
        this.micButton = options.micButton;
        this.statusElement = options.statusElement;
        this.onResult = options.onResult;
        this.recognition = null;
        this.speechTimeout = null;
        
        this.initialize();
    }
    
    /**
     * Initialize speech recognition
     * @returns {boolean} - Whether initialization was successful
     */
    initialize() {
        // Reset recognition if it exists
        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch (e) {
                console.log("No active recognition to stop during init");
            }
            this.recognition = null;
        }
        
        // Browser compatibility check for both standard and webkit versions
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser');
            this.statusElement.textContent = 'Speech recognition not available. Just type the word!';
            this.micButton.disabled = true;
            this.micButton.style.opacity = '0.5';
            return false;
        }
        
        try {
            // Create a new speech recognition instance
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            console.log('Speech recognition initialized successfully');

            // Set up event handlers
            this.recognition.onstart = this.handleStart.bind(this);
            this.recognition.onend = this.handleEnd.bind(this);
            this.recognition.onresult = this.handleResult.bind(this);
            this.recognition.onerror = this.handleError.bind(this);
            
            return true; // Successfully initialized
            
        } catch (error) {
            console.error('Error initializing speech recognition:', error);
            this.statusElement.textContent = "Something went wrong. Try typing instead!";
            this.micButton.disabled = true;
            return false;
        }
    }
    
    /**
     * Start listening for speech
     */
    start() {
        if (!this.recognition) {
            if (!this.initialize()) {
                // If speech recognition can't be initialized, show a message
                // to encourage the child to type instead
                this.statusElement.textContent = "Let's use typing today! Type the word.";
                
                // Focus the input field to make it obvious
                setTimeout(() => {
                    const inputs = document.querySelectorAll('input[type="text"]');
                    if (inputs.length > 0) {
                        inputs[0].focus();
                    }
                }, 1000);
                return;
            }
        }
        
        try {
            console.log('Started new recognition');
            this.recognition.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
            this.statusElement.textContent = "Let's use typing today! Type the word.";
            
            // Focus the input field
            setTimeout(() => {
                const inputs = document.querySelectorAll('input[type="text"]');
                if (inputs.length > 0) {
                    inputs[0].focus();
                }
            }, 1000);
        }
    }
    
    /**
     * Stop listening for speech
     */
    stop() {
        if (this.recognition) {
            console.log('Stopped existing recognition');
            try {
                this.recognition.stop();
            } catch (e) {
                console.log("Error stopping recognition", e);
            }
        }
    }
    
    /**
     * Handle the start of speech recognition
     */
    handleStart() {
        console.log('Speech recognition started');
        this.micButton.classList.add('listening');
        this.statusElement.textContent = 'I\'m listening! Say the word...';
        this.micButton.style.transform = 'scale(1.1)';
        
        // Create some visual effects when listening
        ParticleEffects.createParticlesAroundElement(this.micButton, 'mic');

        // Add timeout after 7 seconds of no speech (extended from 5 to give more time)
        this.speechTimeout = setTimeout(() => {
            if (this.micButton.classList.contains('listening')) {
                console.log('Speech recognition timed out - attempting to restart');
                
                // Try to restart recognition instead of just stopping
                try {
                    this.stop();
                    setTimeout(() => {
                        this.start();
                        this.statusElement.textContent = 'Let\'s try again! Say the word clearly...';
                    }, 1000);
                } catch (e) {
                    console.error('Error restarting speech recognition:', e);
                    this.statusElement.textContent = 'Try again! Press the mic button 🎤';
                }
            }
        }, 7000);
    }
    
    /**
     * Handle the end of speech recognition
     */
    handleEnd() {
        console.log('Speech recognition ended');
        this.micButton.classList.remove('listening');
        this.micButton.classList.remove('auto-listening');
        this.statusElement.textContent = 'Press the mic button 🎤 to say the word!';
        this.micButton.style.transform = 'scale(1)';
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
            this.speechTimeout = null;
        }
    }
    
    /**
     * Handle speech recognition results
     * @param {Event} event - Speech recognition event
     */
    handleResult(event) {
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
            this.speechTimeout = null;
        }
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        const confidence = event.results[0][0].confidence;

        console.log('Speech recognized:', transcript, 'Confidence:', confidence);
        
        // Call the provided result handler
        if (this.onResult) {
            this.onResult(transcript, confidence);
        }
    }
    
    /**
     * Handle speech recognition errors
     * @param {Event} event - Speech recognition error event
     */
    handleError(event) {
        console.error('Speech recognition error:', event.error);
        
        // Simplified error messages for children based on error type
        let message = "I couldn't hear you. Try again!";
        let shouldRetry = false;
        
        // Handle specific error types with child-friendly messages
        switch (event.error) {
            case 'network':
                message = "I can't hear you right now. Please try again!";
                // Network errors often require a retry
                shouldRetry = true;
                break;
            case 'not-allowed':
                message = "I need permission to listen! Please allow your microphone.";
                break;
            case 'aborted':
                message = "Let's try again! Press the mic button.";
                shouldRetry = true;
                break;
            case 'audio-capture':
                message = "I can't find your microphone. Is it connected?";
                break;
            case 'no-speech':
                message = "I didn't hear anything. Please speak a little louder!";
                shouldRetry = true;
                break;
        }
        
        this.statusElement.textContent = message;
        this.micButton.classList.remove('listening');

        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
            this.speechTimeout = null;
        }
        
        // For certain error types, we automatically retry after a short delay
        if (shouldRetry) {
            console.log(`Automatically retrying after ${event.error} error`);
            setTimeout(() => {
                try {
                    // First try to reinitialize the recognition
                    this.initialize();
                    
                    // Then try to start listening again
                    setTimeout(() => {
                        this.start();
                        this.statusElement.textContent = 'Trying again! Say the word...';
                    }, 1000);
                } catch (e) {
                    console.error('Error during automatic retry:', e);
                    // If retry fails, suggest typing instead
                    this.statusElement.textContent = "Let's type instead! Type the word.";
                    
                    // Try to focus the input field
                    setTimeout(() => {
                        const inputs = document.querySelectorAll('input[type="text"]');
                        if (inputs.length > 0) {
                            inputs[0].focus();
                        }
                    }, 1000);
                }
            }, 2000);
        }
    }
}

/**
 * Simple text-to-speech using the Web Speech API
 * @param {string} text - Text to speak
 * @param {number} rate - Speech rate (default: 1.0)
 * @param {number} pitch - Speech pitch (default: 1.0)
 */
function speakWord(text, rate = 0.9, pitch = 1.0) {
    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure options
    utterance.rate = rate;     // Speed (0.1 to 10)
    utterance.pitch = pitch;   // Pitch (0 to 2)
    utterance.volume = 1.0;    // Volume (0 to 1)
    
    // For children, use a slightly higher pitch
    if (pitch === 1.0) {
        utterance.pitch = 1.2;
    }
    
    // Use a female voice if available (often better for children's education apps)
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        // Try to find a female voice
        const femaleVoice = voices.find(voice => 
            voice.name.includes('female') || 
            voice.name.includes('girl') || 
            voice.name.includes('Samantha') ||
            voice.name.includes('Victoria')
        );
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
    }
    
    // Speak the word
    window.speechSynthesis.speak(utterance);
}
/**
 * RewardManager - Handles displaying rewards and feedback to the child
 * Creates a consistent reward system across the application
 */
class RewardManager {
    /**
     * Constructor initializes reward system
     * @param {object} elements - DOM elements needed for rewards
     * @param {Element} elements.puppy - Puppy image element
     * @param {Element} elements.wordDisplay - Word display element
     * @param {Element} elements.rewardContainer - Reward container element
     * @param {Element} elements.interactionItems - Interaction items container
     * @param {Element} elements.speechStatus - Speech status element
     */
    constructor(elements) {
        this.puppy = elements.puppy;
        this.wordDisplay = elements.wordDisplay;
        this.rewardContainer = elements.rewardContainer;
        this.interactionItems = elements.interactionItems;
        this.speechStatus = elements.speechStatus;
        
        // Bind event handlers
        this.hideVideoAndShowPuppy = this.hideVideoAndShowPuppy.bind(this);
    }
    
    /**
     * Show success reward for correct answers
     * @param {object} options - Success display options
     * @param {string} options.message - Optional custom message
     * @param {boolean} options.progression - If this success caused level progression
     * @param {string} options.newLevel - New level after progression
     */
    showSuccessReward(options = {}) {
        // Show large, exciting success feedback with animation
        this.wordDisplay.innerHTML = options.message || '🌟 <span class="success-text">Correct!</span> 🌟';
        this.wordDisplay.style.color = '#FFDE00';
        
        // Immediately display reward options
        this.rewardContainer.style.display = 'block';
        this.interactionItems.style.display = 'flex';
        
        // Congratulate the child with enthusiastic voice
        speakWord("Fantastic! You did it! Choose your reward!");

        // Create large celebration effects around the puppy
        ParticleEffects.createParticlesAroundElement(this.puppy, 'correct');
        
        // Animate the puppy with excitement
        this.puppy.classList.add('happy-bounce');
        setTimeout(() => {
            this.puppy.classList.remove('happy-bounce');
        }, 1500);
        
        // Simple encouraging feedback for children
        this.speechStatus.textContent = `Amazing job! You're so smart! 🎉`;
        
        // Pulse effect on reward options to draw attention
        this.interactionItems.querySelectorAll('.interaction-item').forEach(item => {
            item.classList.add('reward-attention');
            setTimeout(() => {
                item.classList.remove('reward-attention');
            }, 2000);
        });
    }
    
    /**
     * Show feedback for incorrect answers
     * @param {object} options - Incorrect answer options
     * @param {string} options.correctWord - The correct word
     * @param {number} options.percentMatch - How close the match was (0-1)
     */
    showIncorrectFeedback(options) {
        const { message, displayText } = WordMatcher.getEncouragementMessage(
            options.percentMatch, 
            options.correctWord
        );
        
        this.wordDisplay.textContent = displayText;
        this.wordDisplay.style.color = '#ffffff';
        
        // Hide reward options
        this.rewardContainer.style.display = 'none';
        this.interactionItems.style.display = 'none';
        
        // Provide VERY encouraging feedback with the correct word
        speakWord(message);
        
        // Gentle visual feedback - puppy is supportive
        this.puppy.classList.add('encouraging-wiggle');
        
        // Return after feedback complete so caller can handle next steps
        return new Promise(resolve => {
            setTimeout(() => {
                this.puppy.classList.remove('encouraging-wiggle');
                resolve();
            }, 1500);
        });
    }
    
    /**
     * Play interaction video with the puppy
     * @param {string} type - Interaction type ('pet', 'play', 'treat')
     * @param {object} stats - Puppy stats to update
     * @param {number} stats.happiness - Happiness level
     * @param {number} stats.energy - Energy level
     * @returns {boolean} - Whether the interaction was successful
     */
    playInteractionVideo(type, stats) {
        // Hide the puppy image to show the video
        this.puppy.style.opacity = '0';
        
        // Make sure all videos are stopped and hidden
        document.querySelectorAll('.video-container video').forEach(v => {
            v.style.opacity = '0';
            v.style.display = 'none';
            v.pause();
            v.currentTime = 0;
        });
        
        // Select the right video and update stats based on interaction type
        let video;
        switch(type) {
            case 'pet':
                video = document.getElementById('petVideo');
                stats.happiness += 5;
                stats.energy += 2;
                // Give positive feedback
                speakWord("Leo loves pets! Good job!");
                break;
            case 'play':
                if (stats.energy >= 10) {
                    video = document.getElementById('playVideo');
                    stats.happiness += 15;
                    stats.energy -= 10;
                    // Give positive feedback
                    speakWord("Yay! Leo loves playing fetch!");
                } else {
                    // Not enough energy - give feedback
                    speakWord("Leo is too tired to play right now.");
                    // Show the puppy again
                    requestAnimationFrame(() => {
                        this.puppy.style.opacity = '1';
                    });
                    return false;
                }
                break;
            case 'treat':
                video = document.getElementById('treatVideo');
                stats.happiness += 10;
                stats.energy += 15;
                // Give positive feedback
                speakWord("Mmm! Leo loves treats!");
                break;
        }
        
        // Show and play the selected video with animation
        if (video) {
            // Apply a border to the video for better visibility
            video.style.display = 'block';
            
            // Fade in the video
            requestAnimationFrame(() => {
                video.style.opacity = '1';
                video.play().catch(() => {
                    // Fallback if video can't play
                    this.hideVideoAndShowPuppy(video);
                });
            });
            
            // When video ends, fade it out and show the puppy again
            video.onended = () => {
                this.hideVideoAndShowPuppy(video);
                
                // Give feedback when video ends
                speakWord("Great job! Let's try another word!");
            };
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Hide video and show puppy image again
     * @param {Element} video - Video element to hide
     */
    hideVideoAndShowPuppy(video) {
        video.style.opacity = '0';
        setTimeout(() => {
            video.style.display = 'none';
            requestAnimationFrame(() => {
                this.puppy.style.opacity = '1';
            });
        }, 300);
    }
}
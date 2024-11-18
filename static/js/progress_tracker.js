class ProgressTracker {
    constructor() {
        this.loadProgress();
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('learningProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            this.wordHistory = progress.wordHistory || {};
            this.consecutiveCorrect = progress.consecutiveCorrect || 0;
            this.currentLevel = progress.currentLevel || 'easy';
            this.reviewQueue = progress.reviewQueue || [];
            this.successfulAttempts = progress.successfulAttempts || 0;
        } else {
            this.wordHistory = {};
            this.consecutiveCorrect = 0;
            this.currentLevel = 'easy';
            this.reviewQueue = [];
            this.successfulAttempts = 0;
        }
    }

    saveProgress() {
        const progress = {
            wordHistory: this.wordHistory,
            consecutiveCorrect: this.consecutiveCorrect,
            currentLevel: this.currentLevel,
            reviewQueue: this.reviewQueue,
            successfulAttempts: this.successfulAttempts
        };
        localStorage.setItem('learningProgress', JSON.stringify(progress));
    }

    recordAttempt(word, isCorrect) {
        if (!this.wordHistory[word]) {
            this.wordHistory[word] = { attempts: 0, successes: 0 };
        }
        
        this.wordHistory[word].attempts++;
        if (isCorrect) {
            this.wordHistory[word].successes++;
            this.consecutiveCorrect++;
            this.successfulAttempts++;
            this.removeFromReviewQueue(word);
        } else {
            this.consecutiveCorrect = 0;
            this.addToReviewQueue(word);
        }

        this.checkLevelProgression();
        this.saveProgress();
    }

    addToReviewQueue(word) {
        if (!this.reviewQueue.includes(word)) {
            this.reviewQueue.push(word);
        }
    }

    removeFromReviewQueue(word) {
        this.reviewQueue = this.reviewQueue.filter(w => w !== word);
    }

    getSuccessRate() {
        const totalAttempts = Object.values(this.wordHistory)
            .reduce((sum, word) => sum + word.attempts, 0);
        const totalSuccesses = Object.values(this.wordHistory)
            .reduce((sum, word) => sum + word.successes, 0);
        
        return totalAttempts ? (totalSuccesses / totalAttempts) * 100 : 0;
    }

    checkLevelProgression() {
        const successRate = this.getSuccessRate();
        
        if (this.consecutiveCorrect >= 5 && successRate > 80) {
            if (this.currentLevel === 'easy') {
                this.currentLevel = 'medium';
                return 'advance';
            } else if (this.currentLevel === 'medium') {
                this.currentLevel = 'hard';
                return 'advance';
            }
        } else if (successRate < 60) {
            if (this.currentLevel === 'hard') {
                this.currentLevel = 'medium';
                return 'regress';
            } else if (this.currentLevel === 'medium') {
                this.currentLevel = 'easy';
                return 'regress';
            }
        }
        return null;
    }

    getNextWord(wordBank) {
        // Prioritize review words if available
        if (this.reviewQueue.length > 0) {
            return this.reviewQueue[0];
        }
        return null; // Let WordBank choose a new word
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    getProgressStats() {
        return {
            successRate: this.getSuccessRate(),
            wordsAttempted: Object.keys(this.wordHistory).length,
            consecutiveCorrect: this.consecutiveCorrect,
            reviewQueueLength: this.reviewQueue.length
        };
    }
}

class LearningPath {
    constructor() {
        this.loadProgress();
        this.milestones = {
            beginner: {
                wordsNeeded: 10,
                successRate: 70
            },
            intermediate: {
                wordsNeeded: 25,
                successRate: 75
            },
            advanced: {
                wordsNeeded: 50,
                successRate: 80
            },
            expert: {
                wordsNeeded: 100,
                successRate: 85
            }
        };
    }

    loadProgress() {
        const savedPath = localStorage.getItem('learningPathProgress');
        if (savedPath) {
            const progress = JSON.parse(savedPath);
            this.currentLevel = progress.currentLevel || 'beginner';
            this.wordsLearned = progress.wordsLearned || 0;
            this.categoryProgress = progress.categoryProgress || {};
        } else {
            this.currentLevel = 'beginner';
            this.wordsLearned = 0;
            this.categoryProgress = {};
        }
    }

    saveProgress() {
        const progress = {
            currentLevel: this.currentLevel,
            wordsLearned: this.wordsLearned,
            categoryProgress: this.categoryProgress
        };
        localStorage.setItem('learningPathProgress', JSON.stringify(progress));
    }

    recordSuccess(word, category) {
        if (!this.categoryProgress[category]) {
            this.categoryProgress[category] = {
                wordsLearned: new Set(),
                masteryLevel: 0
            };
        }
        
        if (!this.categoryProgress[category].wordsLearned.has(word)) {
            this.categoryProgress[category].wordsLearned.add(word);
            this.wordsLearned++;
            this.updateMasteryLevel(category);
            this.checkLevelProgression();
            this.saveProgress();
        }
    }

    updateMasteryLevel(category) {
        const progress = this.categoryProgress[category];
        const wordsCount = progress.wordsLearned.size;
        
        if (wordsCount >= 25) progress.masteryLevel = 3;
        else if (wordsCount >= 15) progress.masteryLevel = 2;
        else if (wordsCount >= 5) progress.masteryLevel = 1;
        else progress.masteryLevel = 0;
    }

    checkLevelProgression() {
        const nextLevel = {
            'beginner': 'intermediate',
            'intermediate': 'advanced',
            'advanced': 'expert'
        };

        if (this.currentLevel in nextLevel && 
            this.wordsLearned >= this.milestones[this.currentLevel].wordsNeeded) {
            this.currentLevel = nextLevel[this.currentLevel];
            return true;
        }
        return false;
    }

    getProgress() {
        return {
            currentLevel: this.currentLevel,
            wordsLearned: this.wordsLearned,
            categoryProgress: this.categoryProgress,
            nextMilestone: this.milestones[this.currentLevel]
        };
    }

    getCategoryMastery(category) {
        return this.categoryProgress[category]?.masteryLevel || 0;
    }
}

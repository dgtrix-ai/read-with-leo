class WordBank {
    constructor() {
        this.categories = {
            animals: {
                easy: ['cat', 'dog', 'bird', 'fish', 'duck', 'pig', 'hen', 'cow', 'rat', 'frog'],
                medium: ['rabbit', 'turtle', 'monkey', 'panda', 'tiger', 'horse', 'sheep', 'goat', 'bear', 'lion'],
                hard: ['elephant', 'giraffe', 'penguin', 'dolphin', 'kangaroo', 'rhinoceros', 'octopus', 'butterfly', 'crocodile', 'zebra']
            },
            colors: {
                easy: ['red', 'blue', 'pink', 'gray', 'gold', 'green', 'black', 'white', 'brown', 'tan'],
                medium: ['purple', 'orange', 'yellow', 'silver', 'bronze', 'navy', 'coral', 'peach', 'beige', 'teal'],
                hard: ['magenta', 'crimson', 'violet', 'indigo', 'maroon', 'turquoise', 'burgundy', 'lavender', 'emerald', 'azure']
            },
            numbers: {
                easy: ['one', 'two', 'four', 'five', 'ten', 'three', 'six', 'nine', 'zero', 'eight'],
                medium: ['eleven', 'twelve', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'fifteen', 'sixteen'],
                hard: ['hundred', 'thousand', 'million', 'billion', 'thirteen', 'fourteen', 'eighteen', 'nineteen', 'eighty', 'ninety']
            },
            objects: {
                easy: ['ball', 'book', 'toy', 'pen', 'cup', 'box', 'bag', 'hat', 'bed', 'door'],
                medium: ['table', 'chair', 'phone', 'clock', 'brush', 'pencil', 'ruler', 'paper', 'plate', 'glass'],
                hard: ['computer', 'keyboard', 'monitor', 'telescope', 'microscope', 'umbrella', 'calendar', 'dictionary', 'backpack', 'furniture']
            }
        };
        
        this.progressTracker = new ProgressTracker();
        this.currentCategory = 'animals';
    }

    getRandomWord() {
        // Check for review words first
        const reviewWord = this.progressTracker.getNextWord(this);
        if (reviewWord) {
            return reviewWord;
        }

        // Get words from current difficulty and category
        const difficulty = this.progressTracker.getCurrentLevel();
        const categoryWords = this.categories[this.currentCategory][difficulty];
        return categoryWords[Math.floor(Math.random() * categoryWords.length)];
    }

    recordAttempt(word, isCorrect) {
        this.progressTracker.recordAttempt(word, isCorrect);
        const progression = this.progressTracker.checkLevelProgression();
        
        if (progression) {
            return {
                type: progression,
                newLevel: this.progressTracker.getCurrentLevel()
            };
        }
        return null;
    }

    setCategory(category) {
        if (Object.keys(this.categories).includes(category)) {
            this.currentCategory = category;
        }
    }

    getProgressStats() {
        return this.progressTracker.getProgressStats();
    }

    getCurrentLevel() {
        return this.progressTracker.getCurrentLevel();
    }
}

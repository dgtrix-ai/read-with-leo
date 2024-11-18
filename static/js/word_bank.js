class WordBank {
    constructor() {
        this.categories = {
            animals: {
                easy: ['cat', 'dog', 'bird', 'fish', 'duck', 'pig', 'hen', 'cow', 'rat', 'frog', 'ant', 'bee'],
                medium: ['rabbit', 'turtle', 'monkey', 'panda', 'tiger', 'horse', 'sheep', 'goat', 'bear', 'lion', 'snake', 'wolf', 'mouse', 'deer', 'fox'],
                hard: ['elephant', 'giraffe', 'penguin', 'dolphin', 'kangaroo', 'rhinoceros', 'octopus', 'butterfly', 'crocodile', 'zebra', 'cheetah', 'gazelle', 'squirrel', 'hamster', 'koala']
            },
            colors: {
                easy: ['red', 'blue', 'pink', 'gray', 'gold', 'green', 'black', 'white', 'brown', 'tan', 'jade', 'lime'],
                medium: ['purple', 'orange', 'yellow', 'silver', 'bronze', 'navy', 'coral', 'peach', 'beige', 'teal', 'cream', 'olive', 'plum', 'rose', 'mint'],
                hard: ['magenta', 'crimson', 'violet', 'indigo', 'maroon', 'turquoise', 'burgundy', 'lavender', 'emerald', 'azure', 'scarlet', 'cerulean', 'mauve', 'periwinkle', 'chartreuse']
            },
            numbers: {
                easy: ['one', 'two', 'four', 'five', 'ten', 'three', 'six', 'nine', 'zero', 'eight', 'seven', 'first'],
                medium: ['eleven', 'twelve', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'fifteen', 'sixteen', 'second', 'third', 'fourth', 'fifth', 'sixth'],
                hard: ['hundred', 'thousand', 'million', 'billion', 'thirteen', 'fourteen', 'eighteen', 'nineteen', 'eighty', 'ninety', 'seventh', 'eighth', 'ninth', 'tenth', 'quarter']
            },
            objects: {
                easy: ['ball', 'book', 'toy', 'pen', 'cup', 'box', 'bag', 'hat', 'bed', 'door', 'desk', 'lamp', 'fork', 'soap', 'milk'],
                medium: ['table', 'chair', 'phone', 'clock', 'brush', 'pencil', 'ruler', 'paper', 'plate', 'glass', 'bottle', 'mirror', 'window', 'basket', 'pillow'],
                hard: ['computer', 'keyboard', 'monitor', 'telescope', 'microscope', 'umbrella', 'calendar', 'dictionary', 'backpack', 'furniture', 'envelope', 'scissors', 'thermos', 'compass', 'paintbrush']
            },
            food: {
                easy: ['bread', 'milk', 'cake', 'rice', 'fish', 'meat', 'egg', 'soup', 'salt', 'pie', 'corn', 'jam'],
                medium: ['butter', 'cookie', 'cheese', 'coffee', 'carrot', 'orange', 'apple', 'grape', 'pasta', 'pizza', 'salad', 'sauce', 'juice', 'honey', 'candy'],
                hard: ['broccoli', 'spaghetti', 'chocolate', 'strawberry', 'blueberry', 'pineapple', 'sandwich', 'hamburger', 'vegetable', 'mushroom', 'avocado', 'pancake', 'yogurt', 'cereal', 'oatmeal']
            },
            nature: {
                easy: ['sun', 'moon', 'star', 'tree', 'rain', 'snow', 'wind', 'leaf', 'rock', 'sand', 'seed', 'soil'],
                medium: ['flower', 'garden', 'forest', 'river', 'ocean', 'cloud', 'storm', 'beach', 'plant', 'grass', 'water', 'mountain', 'desert', 'valley', 'hill'],
                hard: ['rainbow', 'volcano', 'waterfall', 'glacier', 'thunder', 'lightning', 'blossom', 'sunrise', 'sunset', 'eclipse', 'climate', 'tsunami', 'tornado', 'hurricane', 'earthquake']
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

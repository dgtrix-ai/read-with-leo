class WordBank {
    constructor() {
        this.categories = {
            animals: {
                easy: ['cat', 'dog', 'bird', 'fish', 'duck'],
                medium: ['rabbit', 'turtle', 'monkey', 'panda', 'tiger'],
                hard: ['elephant', 'giraffe', 'penguin', 'dolphin', 'kangaroo']
            },
            colors: {
                easy: ['red', 'blue', 'pink', 'gray', 'gold'],
                medium: ['purple', 'orange', 'yellow', 'brown', 'white'],
                hard: ['magenta', 'crimson', 'violet', 'indigo', 'maroon']
            },
            numbers: {
                easy: ['one', 'two', 'four', 'five', 'ten'],
                medium: ['seven', 'eight', 'three', 'nine', 'six'],
                hard: ['eleven', 'twelve', 'fifteen', 'twenty', 'thirty']
            },
            objects: {
                easy: ['ball', 'book', 'toy', 'pen', 'cup'],
                medium: ['table', 'chair', 'phone', 'clock', 'brush'],
                hard: ['pencil', 'computer', 'window', 'picture', 'blanket']
            }
        };
        
        this.currentDifficulty = 'easy';
        this.currentCategory = 'animals';
    }

    getRandomWord() {
        const categoryWords = this.categories[this.currentCategory][this.currentDifficulty];
        return categoryWords[Math.floor(Math.random() * categoryWords.length)];
    }

    setDifficulty(difficulty) {
        if (['easy', 'medium', 'hard'].includes(difficulty)) {
            this.currentDifficulty = difficulty;
        }
    }

    setCategory(category) {
        if (Object.keys(this.categories).includes(category)) {
            this.currentCategory = category;
        }
    }

    getAllCategories() {
        return Object.keys(this.categories);
    }

    getCurrentDifficulty() {
        return this.currentDifficulty;
    }
}

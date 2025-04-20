/**
 * WordMatcher - A utility class for comparing spoken words to target words
 * This is designed to be very lenient for young children's pronunciation
 */
class WordMatcher {
    /**
     * Compares a spoken word against a target word with multiple matching strategies
     * @param {string} spoken - The word spoken by the child
     * @param {string} target - The target word to match against
     * @returns {object} - Match results with details
     */
    static compareWords(spoken, target) {
        // Clean up both words for comparison (remove non-letters, lowercase)
        const cleanSpoken = spoken.replace(/[^a-zA-Z]/g, '').toLowerCase();
        const cleanTarget = target.replace(/[^a-zA-Z]/g, '').toLowerCase();
        
        // Use multiple matching strategies for children
        const exactMatch = cleanSpoken === cleanTarget;
        const containsMatch = cleanSpoken.includes(cleanTarget);
        const reverseContainsMatch = cleanTarget.includes(cleanSpoken) && cleanSpoken.length > 1;
        const firstLetterMatch = cleanTarget.length <= 3 && cleanSpoken.charAt(0) === cleanTarget.charAt(0);
        
        // Calculate letter matching percentage for more forgiving comparison
        const percentMatch = this.calculatePercentMatch(cleanSpoken, cleanTarget);
        const goodEnoughMatch = percentMatch >= 0.5 && Math.min(cleanSpoken.length, cleanTarget.length) > 1;
        
        // Determine if any of our matching strategies are successful
        const isMatch = exactMatch || containsMatch || reverseContainsMatch || 
                        firstLetterMatch || goodEnoughMatch;
                        
        return {
            isMatch,
            matchDetails: {
                exactMatch, 
                containsMatch, 
                reverseContainsMatch, 
                firstLetterMatch, 
                percentMatch, 
                goodEnoughMatch
            }
        };
    }
    
    /**
     * Calculates what percentage of characters match between two strings
     * @param {string} str1 - First string to compare
     * @param {string} str2 - Second string to compare
     * @returns {number} - Percentage of matching characters (0-1)
     */
    static calculatePercentMatch(str1, str2) {
        let matchCount = 0;
        const minLength = Math.min(str1.length, str2.length);
        
        for (let i = 0; i < minLength; i++) {
            if (str1.charAt(i) === str2.charAt(i)) {
                matchCount++;
            }
        }
        
        return minLength > 0 ? matchCount / minLength : 0;
    }
    
    /**
     * Gets a child-friendly encouragement message based on how close they were
     * @param {number} percentMatch - How close the match was (0-1)
     * @param {string} correctWord - The correct word
     * @returns {object} - Encouragement message and display text
     */
    static getEncouragementMessage(percentMatch, correctWord) {
        if (percentMatch >= 0.3) {
            // They were pretty close
            return {
                message: `You're so close! The word is ${correctWord}.`,
                displayText: '💪 Almost there!'
            };
        } else {
            // They need more guidance
            return {
                message: `Let's try again! The word is ${correctWord}.`,
                displayText: '🔊 Listen one more time!'
            };
        }
    }
}
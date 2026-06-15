// Longest Repeating Character Replacement

// You are given a string s and an integer k.
// You can replace at most k characters in the string so that the
// resulting string contains only one repeating character.

// Return the length of the longest substring you can obtain after
// performing at most k replacements.

// Example 1
// Input: s = "ABAB", k = 2
// Output: 4
// Explanation: Replace the two 'A's or the two 'B's → "AAAA" or "BBBB"

// Example 2
// Input: s = "AABABBA", k = 1
// Output: 4
// Explanation: Replace one character → "AABA" or "ABBA"

// Constraints
// 1 ≤ s.length ≤ 10⁵
// s consists of uppercase English letters
// 0 ≤ k ≤ s.length
function characterReplacementRetry(s: string, k: number): number {
    let left = 0 
    let right = 0
    let longestSubstring = 0 
    let maxFreq = 0 
    while(right < s.length){

    }
}

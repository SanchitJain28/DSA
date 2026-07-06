class Solution______ {
  characterReplacement(s: string, k: number): number {
    let left = 0;
    let right = 0;
    let maxFreq = 0;
    let longestSub = 0;
    const freq = new Map<string, number>();
    while (right < s.length) {
      const ch = s[right];
      freq.set(ch, (freq.get(ch)! || 0) + 1);
      maxFreq = Math.max(maxFreq, freq.get(ch)!);
      while (right - left + 1 - maxFreq > k) {
        const leftCh = s[left];
        freq.set(leftCh, freq.get(leftCh)! - 1);
        left++;
      }
      longestSub = Math.max(longestSub, right - left + 1);
      right++;
    }
    return longestSub;
  }
}

// You are given a string s consisting of only uppercase english characters and an integer k. You can choose up to k characters of the string and replace them with any other uppercase English character.

// After performing at most k replacements, return the length of the longest substring which contains only one distinct character.

// Example 1:

// Input: s = "XYYX", k = 2
// Output: 4

// Explanation: Either replace the 'X's with 'Y's, or replace the 'Y's with 'X's.

// Example 2:

// Input: s = "AAABABB", k = 1

// Output: 5
// Constraints:

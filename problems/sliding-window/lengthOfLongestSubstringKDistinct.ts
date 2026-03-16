// 🧩 Sliding Window — Longest Substring with At Most K Distinct Characters
// Statement

// Given a string s and an integer k, return the length of the longest
// substring that contains at most k distinct characters.

// Example 1
// Input:  s = "eceba", k = 2
// Output: 3
// Explanation: "ece" has at most 2 distinct characters.

// Example 2
// Input:  s = "aa", k = 1
// Output: 2

// Example 3
// Input: s = "aabacbebebe", k = 3
// Output: 7
// Explanation: "cbebebe"

// Constraints

// 0 ≤ s.length ≤ 10⁵

// 0 ≤ k ≤ 10⁵

// s consists of lowercase English letters

// Function Signature
// Input:  s = "eceba", k = 2

function lengthOfLongestSubstringKDistinct(s: string, k: number): number {
  let i = 0;
  let j = 0;
  let longestDistSub = 0;
  const map = new Map<string, number>();
  while (j < s.length) {
    map.set(s[j], (map.get(s[j]) || 0) + 1);

    while (map.size > k) {
      const value = map.get(s[i])! - 1;
      value === 0 ? map.delete(s[i]) : map.set(s[i], value);
      i++;
    }

    j++;
    longestDistSub = Math.max(longestDistSub, j - i);
  }
  return longestDistSub;
}

console.log(lengthOfLongestSubstringKDistinct("aabacbebebe", 3)); //7

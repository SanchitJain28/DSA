// 🧩 Sliding Window (Medium) — Find All Anagrams in a String
// Statement

// Given two strings s and p, return an array of all the start indices
//of p’s anagrams in s.

// An anagram is a word formed by rearranging the letters of another
//word, using all the original letters exactly once.

// Example 1
// Input:  s = "cbaebabacd", p = "abc"
// Output: [0, 6]
// Explanation:
// Substring starting at index 0 is "cba" → anagram of "abc"
// Substring starting at index 6 is "bac" → anagram of "abc"

// Example 2
// Input: s = "abab", p = "ab"
// Output: [0, 1, 2]

// Constraints

// 1 ≤ s.length, p.length ≤ 3 * 10⁴

// s and p consist of lowercase English letters

function findAnagrams(s: string, p: string): number[] {
  let result: number[] = [];
  if (s.length < p.length) return result;

  const freq = new Map<string, number>();

  for (const ch of p) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }

  let left = 0;
  let right = 0;
  let required = p.length;

  while (right < s.length) {
    if (freq.has(s[right])) {
      if (freq.get(s[right])! > 0) required--;
      freq.set(s[right], freq.get(s[right])! - 1);
    }

    right++;

    if (right - left === p.length) {
      if (required === 0) {
        result.push(left);
      }

      if (freq.has(s[left])) {
        if (freq.get(s[left])! >= 0) required++;
        freq.set(s[left], freq.get(s[left])! + 1);
      }

      left++;
    }
  }
  return result;
}

console.log(findAnagrams("cbaebabacd", "abc"));

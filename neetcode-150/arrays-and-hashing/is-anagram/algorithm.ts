function isAnagram_(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const map = new Map();
  for (let ch of s) map.set(ch, (map.get(ch) || 0) + 1);
  for (let ch of t) {
    if (!map.has(ch)) return false;

    const count = map.get(ch)!;

    if (count === 1) map.delete(ch);
    else map.set(ch, count - 1);
  }
  return map.size === 0 ? true : false;
}

// Given two strings s and t, return true if t is an anagram of s, and false otherwise.

// Example 1:
// Input: s = "anagram", t = "nagaram"
// Output: true

// Example 2:
// Input: s = "rat", t = "car"
// Output: false

// Constraints:

// 1 <= s.length, t.length <= 5 * 104
// s and t consist of lowercase English letters.

// Follow up: What if the inputs contain Unicode characters? How would you adapt your solution to such a case?

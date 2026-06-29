function isAnagram(s: string, t: string): boolean {
  if(s.length !== t.length) return false
  const map = new Map();
  for (let i = 0; i < s.length; i++) {
    map.set(s[i], map.get(s[i]) + 1 || 1);
  }

  for (let j = 0; j < t.length; j++) {
    if (map.has(t[j])) {
      let value = map.get(t[j]);
      if (value > 1) map.set(t[j], value - 1);
      else map.delete(t[j]);
    }
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

// 🧩 Easy Sliding Window — Maximum Number of Vowels in a Substring of Length K
// Statement
// Given a string s and an integer k, return the maximum number of
//vowels in any substring of length k.

// Vowels are:
// a, e, i, o, u (lowercase only)

// Example 1
// Input:  s = "abciiidef", k = 3
// Output: 3
// Explanation: "iii" contains 3 vowels

// Example 2
// Input: s = "aeiou", k = 2
// Output: 2

// Example 3
// Input: s = "leetcode", k = 3
// Output: 2

// Constraints
// 1 ≤ s.length ≤ 10⁵
// 1 ≤ k ≤ s.length
// s consists of lowercase English letters

function maxVowels(s: string, k: number): number {
  const vowels = ["a", "e", "i", "o", "u"];
  let str = s.split("");
  let maxVowels = 0;
  let windowVowels = 0;
  for (let i = 0; i < k; i++) {
    if (vowels.includes(str[i])) {
      windowVowels++;
    }
  }
  maxVowels = windowVowels;
  for (let i = k; i < str.length; i++) {
    let newStr = str.slice(i - k + 1, i + 1);
    windowVowels = 0;
    for (let j = 0; j < newStr.length; j++) {
      if (vowels.includes(newStr[j])) {
        windowVowels++;
      }
    }
    maxVowels = Math.max(maxVowels, windowVowels);
  }
  return maxVowels;
}
// Example 1
// Input:  s = "abciiidef", k = 3
// Output: 3
// Explanation: "iii" contains 3 vowels
function maxVowelsSlidingWindow(s: string, k: number): number {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  let maxVowels = 0;
  let windowVowels = 0;
  for (let i = 0; i < k; i++) {
    if (vowels.has(s[i])) windowVowels++;
  }
  maxVowels = windowVowels;
  for (let i = k; i < s.length; i++) {
    if (vowels.has(s[i])) windowVowels++;
    if (vowels.has(s[i - k])) windowVowels--;
    maxVowels = Math.max(maxVowels, windowVowels);
  }
  return maxVowels;
}
console.log(maxVowelsSlidingWindow("abciiidef", 3));

// 🧩 Sliding Window — Longest Substring Without Repeating Characters
// Statement

// Given a string s, find the length of the longest substring without
//repeating characters.

// Example 3
// Input:  "pwwkew"
// Output: 3
// Explanation: "wke"

// Example 1
// Input:  "abcabcbb"
// Output: 3
// Explanation: "abc"

// Example 2
// Input:  "bbbbb"
// Output: 1
// Explanation: "b"

// Constraints
// 0 ≤ s.length ≤ 10⁵
// s consists of English letters, digits, symbols, and spaces

// Function Signature


function lengthOfLongestSubstringDuplicate(s : string) {
  let i =0 
  let j =0 
  const set = new Set()
  let longestSubLen = 0 
  while(j < s.length){
    while(set.has(s[j])){
      set.delete(s[i])
      i++
    }
    set.add(s[j])
    j++
    longestSubLen = Math.max(longestSubLen,j--)
  }
  return longestSubLen
}



function lengthOfLongestSubstring_(s: string): number {
  let i = 0;
  let j = 0;
  let longestSubLen = 0;
  const set = new Set();
  while (j < s.length) {
    while (set.has(s[j])) {
      set.delete(s[i]);
      i++;
    }

    set.add(s[j]);
    j++;
    longestSubLen = Math.max(longestSubLen, j - i);
  }
  return longestSubLen;
}

function longestSubstring(s : string) : number{
  let i =0 
  let j =0 
  let longestSubLen = 0
  const set = new Set()
  while(j < s.length){
    while(set.has(s[j])){
      set.delete(s[i])
      i++
    }
    set.add(s[j])
    j++

    longestSubLen = Math.max(longestSubLen, j-i)
  }
  return longestSubLen
}

console.log(lengthOfLongestSubstring("bbbb"));

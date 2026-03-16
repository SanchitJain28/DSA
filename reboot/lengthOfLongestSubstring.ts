// Problem: Longest Substring Without Repeating Characters
// (You had a massive breakthrough on this one 3 weeks ago. Let's see if the muscle memory is still there.)

// Statement
// Given a string s, find the length of the longest substring without repeating characters.

// Example 1
// Input: s = "abcabcbb"
// Output: 3 (Explanation: The answer is "abc", with the length of 3.)

// Example 2
// Input: s = "pwwkew"
// Output: 3 (Explanation: The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subΩsequence and not a substring.)
//! THIS WAS INCORRECT
function lengthOfLongestSubstring(s: string): number {
  let left = 0;
  let right = 0;
  let freq = new Map<string, number>();
  let lenLongestSubstring = 0;
  while (right < s.length) {
    //we are just setting the map values right now
    if (freq.get(s[right])) {
      //STUCK HERE , i want to remove chracters now , but don't know how
      while (!freq.get(s[right])) {
        freq.set(s[left], freq.get(s[left])! - 1);
        left++;
      }
      freq.set(s[right], freq.get(s[right])! + 1);
    } else {
      freq.set(s[right], 1);
    }
    lenLongestSubstring = Math.max(lenLongestSubstring, right - left + 1);
    right++;
  }
  return lenLongestSubstring;
}
//? CORRECT SOLUTION
function lengthOfLongestSubstringCorrected(s: string): number {
  let left = 0;
  let right = 0;
  let set = new Set();
  let maxLength = 0;
  while (right < s.length) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
    right++;
  }
  return maxLength;
}

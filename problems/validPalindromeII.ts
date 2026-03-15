// 📌 Problem

// Given a string s, return true if it can become a palindrome after deleting at most ONE character.

// 🧪 Examples
// "abca" → true   // remove 'b' or 'c'
// "racecar" → true
// "abc" → false
// "deeee" → true

function validPalindromeII(s: string) {
  let i = 0;
  let j = s.length - 1;
  while (i < j) {
    let fchar = s[i];
    let lchar = s[j];
    if (fchar == lchar) {
      i++;
      j--;
    } else {
      if()
    }
  }
  function isPalindrome(s: string) {
    let sl = s.length;
    let pds = [];
    for (let i = 0; i < sl; i++) {
      pds.push(sl - i - 1);
    }
    if (pds.join("") == s) return true;
    return false;
  }
}

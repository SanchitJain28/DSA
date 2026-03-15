// "abca" → true   // remove 'b' or 'c'
// "racecar" → true
// "abc" → false
// "deeee" → true
function validPalindromeIIRetry(s: string) {
  let i = 0;
  let j = s.length - 1;
  while (i < j) {
    if (s[i] == s[j]) {
      i++;
      j--;
    } else {
      return isPalindrome(s, i + 1, j) || isPalindrome(s, i, j - 1);
    }
  }
  function isPalindrome(s: string, left: number, right: number): boolean {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true
  }
  return true;
}

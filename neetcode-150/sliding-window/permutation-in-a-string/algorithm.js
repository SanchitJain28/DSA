function checkInclusion(s1, s2) {
    var left = 0;
    var right = 0;
    var freq = new Map();
    var k = s1.length;
    var matches = 0;
    //set the freq from which we have to compare
    for (var i = 0; i < s1.length; i++) {
        var ch = s1[i];
        freq.set(ch, (freq.get(ch) || 0) + 1);
    }
    console.log("FREQUENCY", freq);
    while (right < s2.length) {
        var ch = s2[right];
        if (freq.has(ch)) {
            freq.set(ch, freq.get(ch) - 1);
            matches++;
        }
        //shrink the window
        while (right - left + 1 > k) {
            var leftCh = s2[left];
            if (freq.has(leftCh))
                freq.set(leftCh, freq.get(leftCh) + 1);
            matches--;
            left++;
        }
        console.log("MATCHES", matches);
        console.log("SUBARRAY LENGTH", right - left + 1);
        if (matches === k && right - left + 1 === k)
            return true;
        right++;
    }
    return false;
}
checkInclusion("abc", "lecabee");
// You are given two strings s1 and s2.
// Return true if s2 contains a permutation of s1, or false otherwise. That means if a permutation of s1 exists as a substring of s2, then return true.
// Both strings only contain lowercase letters.
// Example 1:
// Input: s1 = "abc", s2 = "lecabee"
// Output: true
// Explanation: The substring "cab" is a permutation of "abc" and is present in "lecabee".
// Example 2:
// Input: s1 = "abc", s2 = "lecaabee"
// Output: false
// Constraints:

// 🧩 Problem: Reverse Words in a String
// Statement
// Given a string s, reverse the order of the words.

// A word is defined as a sequence of non-space characters.
// Words in the output should be separated by a single space.

// Rules :

// Remove leading spaces
// Remove trailing spaces
// Reduce multiple spaces between words to one
// Reverse word order, not characters

// Example 1
// Input:  "the sky is blue"
// Output: "blue is sky the"

// Example 2
// Input:  "  hello   world  "
// Output: "world hello"

// Example 3
// Input: "a good   example"
// Output: "example good a"

// Constraints
// 1 ≤ s.length ≤ 10⁴

// s may contain letters, digits, and spaces

function ReverseWordsInAStringOneLiner(s: string) {
  return s
    .trim()
    .split(" ")
    .filter((a) => a !== "")
    .reverse()
    .join(" ");
}
console.log(ReverseWordsInAStringOneLiner("a good   example"));

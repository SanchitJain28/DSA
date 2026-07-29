function isValid(s: string): boolean {
  let pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  let stack: string[] = [];
  for (let ch of s) {
    if (!pairs[ch]) stack.push(ch);
    else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}

console.log(isValid("((((({{{{{[[[[[]]]]]}}}}})))))"));

// Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

// An input string is valid if:

// Open brackets must be closed by the same type of brackets.
// Open brackets must be closed in the correct order.
// Every close bracket has a corresponding open bracket of the same type.

// Example 1:

// Input: s = "()"
// Output: true

// Example 2:

// Input: s = "()[]{}"
// Output: true

// Example 3:

// Input: s = "]("
// Output: false

// Example 4:

// Input: s = "([])"
// Output: true

// Input: s = "{}{([])}"
// Output: true

// Example 5:

// Input: s = "([)]"
// Output: false

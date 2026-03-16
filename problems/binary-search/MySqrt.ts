// 🧩 Problem — Square Root (Integer)

// Given a non-negative integer x,
// compute and return the integer square root of x.

// The integer square root is:
// The largest integer y such that y * y <= x.

// You are not allowed to use:
// Math.sqrt()
// Any built-in power function
// Time complexity must be O(log x).

// 🧪 Example 1
// Input: x = 4
// Output: 2
// 🧪 Example 2
// Input: x = 8
// Output: 2

// Explanation:
// √8 ≈ 2.828
// Integer part is 2.

// 🧪 Example 3
// Input: x = 0
// Output: 0
// 🧠 Function Signature
function mySqrt(x: number): number {
  if (x < 2) return x;
  let left = 1;
  let right = Math.floor(x / 2);
  let ans = 0;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    let square = mid * mid;
    if (square === x) {
      return mid;
    } else if (square < x) {
      ans = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return ans;
}

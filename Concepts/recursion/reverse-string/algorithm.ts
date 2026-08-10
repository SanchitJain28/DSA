// ? Normal ass solution
function reverseString_(s: string[]): void {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}

// Recusive
function reverseString(
  s: string[],
  left: number = 0,
  right: number = s.length - 1,
): void {
  if (left > right) return;
  let temp = s[left];
  s[left] = s[right];
  s[right] = temp;
  return reverseString(s, left + 1, right - 1);
}
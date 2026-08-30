class Solution_reverseString {
  reverseString(
    s: string[],
    left: number = 0,
    right: number = s.length - 1,
  ): void {
    if (left >= right) return;
    let temp = s[right];
    s[right] = s[left];
    s[left] = temp;
    return this.reverseString(s, left + 1, right - 1);
  }
}

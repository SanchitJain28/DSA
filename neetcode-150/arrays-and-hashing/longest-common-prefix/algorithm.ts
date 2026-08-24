function longestCommonPrefix(strs: string[]): string {
  let longestPrefix = "";
  for (let i = 0; i < strs[0].length; i++) {
    let char = strs[0][i];
    for (let j = 0; j < strs.length; j++) {
      if (strs[j][i] !== char) return longestPrefix;
    }
    longestPrefix += char;
  }
  return longestPrefix;
}

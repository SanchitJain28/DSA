function mergeAlternately(word1: string, word2: string): string {
  let result = "";
  let toAppend = "";
  for (let i = 0; i < Math.max(word1.length, word2.length); i++) {
    if (!word1[i] || !word2[i]) {
      console.log("Finalsizing");
      result += word1[i]
        ? word1.slice(i, word1.length)
        : word2.slice(i, word2.length);
      return result;
    }
    result += word1[i];
    result += word2[i];
  }
  return result;
}

console.log(mergeAlternately("ab", "pqrs")); // Output: "apbqcr"

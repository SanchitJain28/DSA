function findAnagramsRetry(s: string, p: string) {
  let result: number[] = [];
  if (s.length < p.length) return result;
  const freq = new Map<string, number>();
  for (const ch of p) {
    freq.set(ch, (freq.get(ch)! || 0) + 1);
  }
  let i = 0;
  let j = 0;
  let required = p.length;
  while (j < s.length) {
    if (freq.has(s[j])) {
      if (freq.get(s[j])! > 0) required--;
      freq.set(s[j], freq.get(s[j])! - 1);
    }
    j++;
    if (j - i === p.length) {
      if (required === 0) {
        result.push(i);
      }

      if (freq.has(s[i])) {
        if (freq.get(s[i])! >= 0) required++;
        freq.set(s[i], freq.get(s[i])! + 1);
      }
      i++;
    }
  }
  return result;
}

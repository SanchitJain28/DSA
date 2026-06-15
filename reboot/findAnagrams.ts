function findAnagramsReboot(s: string, p: string): number[] {
  const result: number[] = [];
  
  if (s.length < p.length) return result;

  let freq = new Map<string, number>();
  for (let i = 0; i < p.length; i++) {
    freq.set(p[i], (freq.get(p[i]) || 0) + 1);
  }

  let left = 0;
  let right = 0;
  let required = p.length;

  while (right < s.length) {
    if (freq.has(s[right])) {
      if (freq.get(s[right])! > 0) required--;
      freq.set(s[right], freq.get(s[right])! - 1);
    }
    while (right - left + 1 === p.length) {
      if (required === 0) result.push(left);

      if (freq.has(s[left])) {
        if (freq.get(s[left])! >= 0) required++;
        freq.set(s[left], (freq.get(s[left]) || 0) + 1);
      }
      left++;
    }
    right++;
  }
  return result;
}

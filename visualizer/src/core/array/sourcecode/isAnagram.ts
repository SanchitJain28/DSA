export const isAnagramCode = [
  { line: 1, text: "function isAnagramOptimized(s: string, p: string) {" },
  { line: 2, text: "  const map = new Map<string, number>();" },
  { line: 3, text: "  for (let ch of s) map.set(ch, (map.get(ch) ?? 0) + 1);" },
  { line: 4, text: "  for (let ch of p) {" },
  { line: 5, text: "    if (map.has(ch)) {" },
  { line: 6, text: "      let value = map.get(ch)! - 1;" },
  { line: 7, text: "      value === 0 ? map.delete(ch) : map.set(ch, value);" },
  { line: 8, text: "    } else return false;" },
  { line: 9, text: "  }" },
  { line: 10, text: "  return map.size === 0 ? true : false;" },
  { line: 11, text: "}" },
];

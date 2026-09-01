import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function isAnagram(s, p) {" },
  { line: 2, text: "  const map = new Map();" },
  { line: 3, text: "  for (let i = 0; i < s.length; i++) {" },
  { line: 4, text: "    map.set(s[i], (map.get(s[i]) || 0) + 1);" },
  { line: 5, text: "  }" },
  { line: 6, text: "  for (let j = 0; j < p.length; j++) {" },
  { line: 7, text: "    if (!map.has(p[j])) return false;" },
  { line: 8, text: "    const count = map.get(p[j]) - 1;" },
  { line: 9, text: "    if (count === 0) map.delete(p[j]);" },
  { line: 10, text: "    else map.set(p[j], count);" },
  { line: 11, text: "  }" },
  { line: 12, text: "  return map.size === 0;" },
  { line: 13, text: "}" },
];

export default source;

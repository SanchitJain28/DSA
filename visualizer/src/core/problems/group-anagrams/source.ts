import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function groupAnagrams(strs) {" },
  { line: 2, text: "  const map = new Map();" },
  { line: 3, text: "  const result = [];" },
  { line: 4, text: "  for (let i = 0; i < strs.length; i++) {" },
  { line: 5, text: '    const sorted = strs[i].split("").sort().join("");' },
  { line: 6, text: "    if (map.has(sorted)) {" },
  { line: 7, text: "      result[map.get(sorted)].push(strs[i]);" },
  { line: 8, text: "    } else {" },
  { line: 9, text: "      map.set(sorted, result.length);" },
  { line: 10, text: "      result.push([strs[i]]);" },
  { line: 11, text: "    }" },
  { line: 12, text: "  }" },
  { line: 13, text: "  return result;" },
  { line: 14, text: "}" },
];

export default source;

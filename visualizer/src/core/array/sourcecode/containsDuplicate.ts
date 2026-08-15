export const containsDuplicateCode = [
  { line: 1, text: "function containsDuplicate(nums: number[]): boolean {" },
  { line: 2, text: "  const map = new Map();" },
  { line: 3, text: "  for (const num of nums) {" },
  { line: 4, text: "    if (map.has(num)) return true;" },
  { line: 5, text: "    map.set(num, true);" },
  { line: 6, text: "  }" },
  { line: 7, text: "  return false;" },
  { line: 8, text: "}" },
];

export const twoSumCode = [
  { line: 1, text: "function twoSum(nums: number[], target: number): number[] {" },
  { line: 2, text: "  const map = new Map<number, number>();" },
  { line: 3, text: "  for (let i = 0; i < nums.length; i++) {" },
  { line: 4, text: "    let needed = target - nums[i];" },
  { line: 5, text: "    if (map.has(needed)) {" },
  { line: 6, text: "      return [map.get(needed)!, i];" },
  { line: 7, text: "    } else {" },
  { line: 8, text: "      map.set(nums[i], i);" },
  { line: 9, text: "    }" },
  { line: 10, text: "  }" },
  { line: 11, text: "  return [-1, -1];" },
  { line: 12, text: "}" }
];

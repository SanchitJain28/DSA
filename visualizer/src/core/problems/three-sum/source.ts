import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function threeSum(nums) {" },
  { line: 2, text: "  if (!nums.length) return [];" },
  { line: 3, text: "  nums.sort((a, b) => a - b);" },
  { line: 4, text: "  const result = [];" },
  { line: 5, text: "  const n = nums.length;" },
  { line: 6, text: "  for (let i = 0; i < n - 2; i++) {" },
  { line: 7, text: "    if (i > 0 && nums[i] === nums[i - 1]) continue;" },
  { line: 8, text: "    let j = i + 1, k = n - 1;" },
  { line: 9, text: "    while (j < k) {" },
  { line: 10, text: "      const sum = nums[i] + nums[j] + nums[k];" },
  { line: 11, text: "      if (sum === 0) {" },
  { line: 12, text: "        result.push([nums[i], nums[j], nums[k]]);" },
  { line: 13, text: "        j++; k--;" },
  { line: 14, text: "        while (j < k && nums[j] === nums[j - 1]) j++;" },
  { line: 15, text: "        while (j < k && nums[k] === nums[k + 1]) k--;" },
  { line: 16, text: "      } else if (sum < 0) {" },
  { line: 17, text: "        j++;" },
  { line: 18, text: "      } else {" },
  { line: 19, text: "        k--;" },
  { line: 20, text: "      }" },
  { line: 21, text: "    }" },
  { line: 22, text: "  }" },
  { line: 23, text: "  return result;" },
  { line: 24, text: "}" },
];

export default source;

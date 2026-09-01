import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function nextGreaterElement(nums1, nums2) {" },
  { line: 2, text: "  const nextGreater = new Map();" },
  { line: 3, text: "  const stack = [];" },
  { line: 4, text: "  for (let i = 0; i < nums2.length; i++) {" },
  { line: 5, text: "    const num = nums2[i];" },
  { line: 6, text: "    while (stack.length && stack[stack.length - 1] < num) {" },
  { line: 7, text: "      const popped = stack.pop();" },
  { line: 8, text: "      nextGreater.set(popped, num);" },
  { line: 9, text: "    }" },
  { line: 10, text: "    stack.push(num);" },
  { line: 11, text: "  }" },
  { line: 12, text: "  const ans = [];" },
  { line: 13, text: "  for (let j = 0; j < nums1.length; j++) {" },
  { line: 14, text: "    ans.push(nextGreater.get(nums1[j]) ?? -1);" },
  { line: 15, text: "  }" },
  { line: 16, text: "  return ans;" },
  { line: 17, text: "}" },
];

export default source;

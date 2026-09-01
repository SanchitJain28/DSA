import type { ProblemMeta, Scene, SourceCodeLine } from "@/core/shared/types";
import type { VisualizerType, ProblemInfo } from "@/types/visualizer";

// Array & Hashing Problems
import twoSumMeta from "@/core/problems/two-sum/meta";
import twoSumSource from "@/core/problems/two-sum/source";
import { generateFrames as twoSumFrames } from "@/core/problems/two-sum/frames";

import containsDuplicateMeta from "@/core/problems/contains-duplicate/meta";
import containsDuplicateSource from "@/core/problems/contains-duplicate/source";
import { generateFrames as containsDuplicateFrames } from "@/core/problems/contains-duplicate/frames";

import isAnagramMeta from "@/core/problems/is-anagram/meta";
import isAnagramSource from "@/core/problems/is-anagram/source";
import { generateFrames as isAnagramFrames } from "@/core/problems/is-anagram/frames";

import groupAnagramsMeta from "@/core/problems/group-anagrams/meta";
import groupAnagramsSource from "@/core/problems/group-anagrams/source";
import { generateFrames as groupAnagramsFrames } from "@/core/problems/group-anagrams/frames";

import sortedSquaresMeta from "@/core/problems/sorted-squares/meta";
import sortedSquaresSource from "@/core/problems/sorted-squares/source";
import { generateFrames as sortedSquaresFrames } from "@/core/problems/sorted-squares/frames";

import threeSumMeta from "@/core/problems/three-sum/meta";
import threeSumSource from "@/core/problems/three-sum/source";
import { generateFrames as threeSumFrames } from "@/core/problems/three-sum/frames";

import validSudokuMeta from "@/core/problems/valid-sudoku/meta";
import validSudokuSource from "@/core/problems/valid-sudoku/source";
import { generateFrames as validSudokuFrames } from "@/core/problems/valid-sudoku/frames";

import longestConsecutiveMeta from "@/core/problems/longest-consecutive/meta";
import longestConsecutiveSource from "@/core/problems/longest-consecutive/source";
import { generateFrames as longestConsecutiveFrames } from "@/core/problems/longest-consecutive/frames";

// Binary Search Problems
import searchInsertMeta from "@/core/problems/search-insert/meta";
import searchInsertSource from "@/core/problems/search-insert/source";
import { generateFrames as searchInsertFrames } from "@/core/problems/search-insert/frames";

import search2DMatrixMeta from "@/core/problems/search-2d-matrix/meta";
import search2DMatrixSource from "@/core/problems/search-2d-matrix/source";
import { generateFrames as search2DMatrixFrames } from "@/core/problems/search-2d-matrix/frames";

import findMinMeta from "@/core/problems/find-min-rotated-array/meta";
import findMinSource from "@/core/problems/find-min-rotated-array/source";
import { generateFrames as findMinFrames } from "@/core/problems/find-min-rotated-array/frames";

import searchRotatedMeta from "@/core/problems/search-rotated-array/meta";
import searchRotatedSource from "@/core/problems/search-rotated-array/source";
import { generateFrames as searchRotatedFrames } from "@/core/problems/search-rotated-array/frames";

import shipWithinDaysMeta from "@/core/problems/ship-within-days/meta";
import shipWithinDaysSource from "@/core/problems/ship-within-days/source";
import { generateFrames as shipWithinDaysFrames } from "@/core/problems/ship-within-days/frames";

import kokoEatingBananasMeta from "@/core/problems/koko-eating-bananas/meta";
import kokoEatingBananasSource from "@/core/problems/koko-eating-bananas/source";
import { generateFrames as kokoEatingBananasFrames } from "@/core/problems/koko-eating-bananas/frames";

// Stack Problems
import validParenthesesMeta from "@/core/problems/valid-parentheses/meta";
import validParenthesesSource from "@/core/problems/valid-parentheses/source";
import { generateFrames as validParenthesesFrames } from "@/core/problems/valid-parentheses/frames";

import dailyTemperaturesMeta from "@/core/problems/daily-temperatures/meta";
import dailyTemperaturesSource from "@/core/problems/daily-temperatures/source";
import { generateFrames as dailyTemperaturesFrames } from "@/core/problems/daily-temperatures/frames";

import nextGreaterElementMeta from "@/core/problems/next-greater-element/meta";
import nextGreaterElementSource from "@/core/problems/next-greater-element/source";
import { generateFrames as nextGreaterElementFrames } from "@/core/problems/next-greater-element/frames";

import asteroidCollisionMeta from "@/core/problems/asteroid-collision/meta";
import asteroidCollisionSource from "@/core/problems/asteroid-collision/source";
import { generateFrames as asteroidCollisionFrames } from "@/core/problems/asteroid-collision/frames";

import carFleetMeta from "@/core/problems/car-fleet/meta";
import carFleetSource from "@/core/problems/car-fleet/source";
import { generateFrames as carFleetFrames } from "@/core/problems/car-fleet/frames";

// Sliding Window Problems
import longestCharReplacementMeta from "@/core/problems/longest-repeating-char-replacement/meta";
import longestCharReplacementSource from "@/core/problems/longest-repeating-char-replacement/source";
import { generateFrames as longestCharReplacementFrames } from "@/core/problems/longest-repeating-char-replacement/frames";

// Linked List Problems
import middleNodeMeta from "@/core/problems/middle-node/meta";
import middleNodeSource from "@/core/problems/middle-node/source";
import { generateFrames as middleNodeFrames } from "@/core/problems/middle-node/frames";

import hasCycleMeta from "@/core/problems/has-cycle/meta";
import hasCycleSource from "@/core/problems/has-cycle/source";
import { generateFrames as hasCycleFrames } from "@/core/problems/has-cycle/frames";

import removeNthFromEndMeta from "@/core/problems/remove-nth-from-end/meta";
import removeNthFromEndSource from "@/core/problems/remove-nth-from-end/source";
import { generateFrames as removeNthFromEndFrames } from "@/core/problems/remove-nth-from-end/frames";

import swapPairsMeta from "@/core/problems/swap-pairs/meta";
import swapPairsSource from "@/core/problems/swap-pairs/source";
import { generateFrames as swapPairsFrames } from "@/core/problems/swap-pairs/frames";

import rotateListMeta from "@/core/problems/rotate-list/meta";
import rotateListSource from "@/core/problems/rotate-list/source";
import { generateFrames as rotateListFrames } from "@/core/problems/rotate-list/frames";

import reorderListMeta from "@/core/problems/reorder-list/meta";
import reorderListSource from "@/core/problems/reorder-list/source";
import { generateFrames as reorderListFrames } from "@/core/problems/reorder-list/frames";

import partitionListMeta from "@/core/problems/partition-list/meta";
import partitionListSource from "@/core/problems/partition-list/source";
import { generateFrames as partitionListFrames } from "@/core/problems/partition-list/frames";

import sortListMeta from "@/core/problems/sort-list/meta";
import sortListSource from "@/core/problems/sort-list/source";
import { generateFrames as sortListFrames } from "@/core/problems/sort-list/frames";

// Recursion & DP Problems
import reverseStringMeta from "@/core/problems/reverse-string/meta";
import reverseStringSource from "@/core/problems/reverse-string/source";
import { generateFrames as reverseStringFrames } from "@/core/problems/reverse-string/frames";

import climbStairsTreeMeta from "@/core/problems/climb-stairs-tree/meta";
import climbStairsTreeSource from "@/core/problems/climb-stairs-tree/source";
import { generateFrames as climbStairsTreeFrames } from "@/core/problems/climb-stairs-tree/frames";

import climbStairsDpMeta from "@/core/problems/climb-stairs-dp/meta";
import climbStairsDpSource from "@/core/problems/climb-stairs-dp/source";
import { generateFrames as climbStairsDpFrames } from "@/core/problems/climb-stairs-dp/frames";

// Trees & BST Problems (Batch 1)
import preorderMeta from "@/core/problems/preorder/meta";
import preorderSource from "@/core/problems/preorder/source";
import { generateFrames as preorderFrames } from "@/core/problems/preorder/frames";

import inorderMeta from "@/core/problems/inorder/meta";
import inorderSource from "@/core/problems/inorder/source";
import { generateFrames as inorderFrames } from "@/core/problems/inorder/frames";

import postorderMeta from "@/core/problems/postorder/meta";
import postorderSource from "@/core/problems/postorder/source";
import { generateFrames as postorderFrames } from "@/core/problems/postorder/frames";

import invertMeta from "@/core/problems/invert-tree/meta";
import invertSource from "@/core/problems/invert-tree/source";
import { generateFrames as invertFrames } from "@/core/problems/invert-tree/frames";

import maxDepthMeta from "@/core/problems/max-depth/meta";
import maxDepthSource from "@/core/problems/max-depth/source";
import { generateFrames as maxDepthFrames } from "@/core/problems/max-depth/frames";

import diameterMeta from "@/core/problems/diameter-of-binary-tree/meta";
import diameterSource from "@/core/problems/diameter-of-binary-tree/source";
import { generateFrames as diameterFrames } from "@/core/problems/diameter-of-binary-tree/frames";

// Trees & BST Problems (Batch 2)
import balancedMeta from "@/core/problems/balanced-binary-tree/meta";
import balancedSource from "@/core/problems/balanced-binary-tree/source";
import { generateFrames as balancedFrames } from "@/core/problems/balanced-binary-tree/frames";

import sameTreeMeta from "@/core/problems/same-tree/meta";
import sameTreeSource from "@/core/problems/same-tree/source";
import { generateFrames as sameTreeFrames } from "@/core/problems/same-tree/frames";

import subtreeMeta from "@/core/problems/subtree-of-another-tree/meta";
import subtreeSource from "@/core/problems/subtree-of-another-tree/source";
import { generateFrames as subtreeFrames } from "@/core/problems/subtree-of-another-tree/frames";

import symmetricMeta from "@/core/problems/symmetric-tree/meta";
import symmetricSource from "@/core/problems/symmetric-tree/source";
import { generateFrames as symmetricFrames } from "@/core/problems/symmetric-tree/frames";

import pathSumMeta from "@/core/problems/path-sum/meta";
import pathSumSource from "@/core/problems/path-sum/source";
import { generateFrames as pathSumFrames } from "@/core/problems/path-sum/frames";

import pathSumIIMeta from "@/core/problems/path-sum-ii/meta";
import pathSumIISource from "@/core/problems/path-sum-ii/source";
import { generateFrames as pathSumIIFrames } from "@/core/problems/path-sum-ii/frames";

// Trees & BST Problems (Batch 3)
import sumNumbersMeta from "@/core/problems/sum-root-to-leaf-numbers/meta";
import sumNumbersSource from "@/core/problems/sum-root-to-leaf-numbers/source";
import { generateFrames as sumNumbersFrames } from "@/core/problems/sum-root-to-leaf-numbers/frames";

import countNodesMeta from "@/core/problems/count-complete-tree-nodes/meta";
import countNodesSource from "@/core/problems/count-complete-tree-nodes/source";
import { generateFrames as countNodesFrames } from "@/core/problems/count-complete-tree-nodes/frames";

import goodNodesMeta from "@/core/problems/count-good-nodes-in-binary-tree/meta";
import goodNodesSource from "@/core/problems/count-good-nodes-in-binary-tree/source";
import { generateFrames as goodNodesFrames } from "@/core/problems/count-good-nodes-in-binary-tree/frames";

import lcaMeta from "@/core/problems/lowest-common-ancestor-of-bst/meta";
import lcaSource from "@/core/problems/lowest-common-ancestor-of-bst/source";
import { generateFrames as lcaFrames } from "@/core/problems/lowest-common-ancestor-of-bst/frames";

import isValidBSTMeta from "@/core/problems/validate-binary-search-tree/meta";
import isValidBSTSource from "@/core/problems/validate-binary-search-tree/source";
import { generateFrames as isValidBSTFrames } from "@/core/problems/validate-binary-search-tree/frames";

// Trees & BST Problems (Batch 4)
import kthSmallestMeta from "@/core/problems/kth-smallest-element-in-a-bst/meta";
import kthSmallestSource from "@/core/problems/kth-smallest-element-in-a-bst/source";
import { generateFrames as kthSmallestFrames } from "@/core/problems/kth-smallest-element-in-a-bst/frames";

import levelOrderMeta from "@/core/problems/binary-tree-level-order-traversal/meta";
import levelOrderSource from "@/core/problems/binary-tree-level-order-traversal/source";
import { generateFrames as levelOrderFrames } from "@/core/problems/binary-tree-level-order-traversal/frames";

import zigzagLevelOrderMeta from "@/core/problems/binary-tree-zigzag-level-order-traversal/meta";
import zigzagLevelOrderSource from "@/core/problems/binary-tree-zigzag-level-order-traversal/source";
import { generateFrames as zigzagLevelOrderFrames } from "@/core/problems/binary-tree-zigzag-level-order-traversal/frames";

import rightSideViewMeta from "@/core/problems/binary-tree-right-side-view/meta";
import rightSideViewSource from "@/core/problems/binary-tree-right-side-view/source";
import { generateFrames as rightSideViewFrames } from "@/core/problems/binary-tree-right-side-view/frames";

import widthOfBinaryTreeMeta from "@/core/problems/maximum-width-of-binary-tree/meta";
import widthOfBinaryTreeSource from "@/core/problems/maximum-width-of-binary-tree/source";
import { generateFrames as widthOfBinaryTreeFrames } from "@/core/problems/maximum-width-of-binary-tree/frames";

import maxPathSumMeta from "@/core/problems/binary-tree-maximum-path-sum/meta";
import maxPathSumSource from "@/core/problems/binary-tree-maximum-path-sum/source";
import { generateFrames as maxPathSumFrames } from "@/core/problems/binary-tree-maximum-path-sum/frames";

// Heap / Priority Queue Problems
import minHeapMeta from "@/core/problems/min-heap/meta";
import minHeapSource from "@/core/problems/min-heap/source";
import { generateFrames as minHeapFrames } from "@/core/problems/min-heap/frames";

export interface ProblemEntry {
  meta: ProblemMeta<any>;
  source: SourceCodeLine[];
  generateFrames: (data: any) => Scene[];
}

export const PROBLEMS_REGISTRY: Record<string, ProblemEntry> = {
  // Array & Hashing
  twosum: {
    meta: twoSumMeta,
    source: twoSumSource,
    generateFrames: twoSumFrames,
  },
  containsduplicate: {
    meta: containsDuplicateMeta,
    source: containsDuplicateSource,
    generateFrames: containsDuplicateFrames,
  },
  isanagram: {
    meta: isAnagramMeta,
    source: isAnagramSource,
    generateFrames: isAnagramFrames,
  },
  groupanagrams: {
    meta: groupAnagramsMeta,
    source: groupAnagramsSource,
    generateFrames: groupAnagramsFrames,
  },
  sortedsquares: {
    meta: sortedSquaresMeta,
    source: sortedSquaresSource,
    generateFrames: sortedSquaresFrames,
  },
  threesum: {
    meta: threeSumMeta,
    source: threeSumSource,
    generateFrames: threeSumFrames,
  },
  validsudoku: {
    meta: validSudokuMeta,
    source: validSudokuSource,
    generateFrames: validSudokuFrames,
  },
  longestconsecutive: {
    meta: longestConsecutiveMeta,
    source: longestConsecutiveSource,
    generateFrames: longestConsecutiveFrames,
  },
  // Binary Search
  searchinsert: {
    meta: searchInsertMeta,
    source: searchInsertSource,
    generateFrames: searchInsertFrames,
  },
  search2dmatrix: {
    meta: search2DMatrixMeta,
    source: search2DMatrixSource,
    generateFrames: search2DMatrixFrames,
  },
  findmin: {
    meta: findMinMeta,
    source: findMinSource,
    generateFrames: findMinFrames,
  },
  searchrotated: {
    meta: searchRotatedMeta,
    source: searchRotatedSource,
    generateFrames: searchRotatedFrames,
  },
  shipwithindays: {
    meta: shipWithinDaysMeta,
    source: shipWithinDaysSource,
    generateFrames: shipWithinDaysFrames,
  },
  kokoeatingbananas: {
    meta: kokoEatingBananasMeta,
    source: kokoEatingBananasSource,
    generateFrames: kokoEatingBananasFrames,
  },
  // Stack
  validparentheses: {
    meta: validParenthesesMeta,
    source: validParenthesesSource,
    generateFrames: validParenthesesFrames,
  },
  dailytemperatures: {
    meta: dailyTemperaturesMeta,
    source: dailyTemperaturesSource,
    generateFrames: dailyTemperaturesFrames,
  },
  nextgreaterelement: {
    meta: nextGreaterElementMeta,
    source: nextGreaterElementSource,
    generateFrames: nextGreaterElementFrames,
  },
  asteroidcollision: {
    meta: asteroidCollisionMeta,
    source: asteroidCollisionSource,
    generateFrames: asteroidCollisionFrames,
  },
  carfleet: {
    meta: carFleetMeta,
    source: carFleetSource,
    generateFrames: carFleetFrames,
  },
  // Sliding Window
  longestcharreplacement: {
    meta: longestCharReplacementMeta,
    source: longestCharReplacementSource,
    generateFrames: longestCharReplacementFrames,
  },
  // Linked List
  middlenode: {
    meta: middleNodeMeta,
    source: middleNodeSource,
    generateFrames: middleNodeFrames,
  },
  hascycle: {
    meta: hasCycleMeta,
    source: hasCycleSource,
    generateFrames: hasCycleFrames,
  },
  removenthfromend: {
    meta: removeNthFromEndMeta,
    source: removeNthFromEndSource,
    generateFrames: removeNthFromEndFrames,
  },
  swappairs: {
    meta: swapPairsMeta,
    source: swapPairsSource,
    generateFrames: swapPairsFrames,
  },
  rotatelist: {
    meta: rotateListMeta,
    source: rotateListSource,
    generateFrames: rotateListFrames,
  },
  reorderlist: {
    meta: reorderListMeta,
    source: reorderListSource,
    generateFrames: reorderListFrames,
  },
  partitionlist: {
    meta: partitionListMeta,
    source: partitionListSource,
    generateFrames: partitionListFrames,
  },
  sortlist: {
    meta: sortListMeta,
    source: sortListSource,
    generateFrames: sortListFrames,
  },
  // Recursion & DP
  reversestring: {
    meta: reverseStringMeta,
    source: reverseStringSource,
    generateFrames: reverseStringFrames,
  },
  climbstairstree: {
    meta: climbStairsTreeMeta,
    source: climbStairsTreeSource,
    generateFrames: climbStairsTreeFrames,
  },
  climbstairsdp: {
    meta: climbStairsDpMeta,
    source: climbStairsDpSource,
    generateFrames: climbStairsDpFrames,
  },
  // Trees & BST (Batch 1)
  preorder: {
    meta: preorderMeta,
    source: preorderSource,
    generateFrames: preorderFrames,
  },
  inorder: {
    meta: inorderMeta,
    source: inorderSource,
    generateFrames: inorderFrames,
  },
  postorder: {
    meta: postorderMeta,
    source: postorderSource,
    generateFrames: postorderFrames,
  },
  invert: {
    meta: invertMeta,
    source: invertSource,
    generateFrames: invertFrames,
  },
  maxdepth: {
    meta: maxDepthMeta,
    source: maxDepthSource,
    generateFrames: maxDepthFrames,
  },
  diameter: {
    meta: diameterMeta,
    source: diameterSource,
    generateFrames: diameterFrames,
  },
  // Trees & BST (Batch 2)
  balanced: {
    meta: balancedMeta,
    source: balancedSource,
    generateFrames: balancedFrames,
  },
  sametree: {
    meta: sameTreeMeta,
    source: sameTreeSource,
    generateFrames: sameTreeFrames,
  },
  subtree: {
    meta: subtreeMeta,
    source: subtreeSource,
    generateFrames: subtreeFrames,
  },
  symmetric: {
    meta: symmetricMeta,
    source: symmetricSource,
    generateFrames: symmetricFrames,
  },
  pathsum: {
    meta: pathSumMeta,
    source: pathSumSource,
    generateFrames: pathSumFrames,
  },
  pathsum2: {
    meta: pathSumIIMeta,
    source: pathSumIISource,
    generateFrames: pathSumIIFrames,
  },
  // Trees & BST (Batch 3)
  sumnumbers: {
    meta: sumNumbersMeta,
    source: sumNumbersSource,
    generateFrames: sumNumbersFrames,
  },
  countnodes: {
    meta: countNodesMeta,
    source: countNodesSource,
    generateFrames: countNodesFrames,
  },
  goodnodes: {
    meta: goodNodesMeta,
    source: goodNodesSource,
    generateFrames: goodNodesFrames,
  },
  lca: {
    meta: lcaMeta,
    source: lcaSource,
    generateFrames: lcaFrames,
  },
  isvalidbst: {
    meta: isValidBSTMeta,
    source: isValidBSTSource,
    generateFrames: isValidBSTFrames,
  },
  // Trees & BST (Batch 4)
  kthsmallest: {
    meta: kthSmallestMeta,
    source: kthSmallestSource,
    generateFrames: kthSmallestFrames,
  },
  levelorder: {
    meta: levelOrderMeta,
    source: levelOrderSource,
    generateFrames: levelOrderFrames,
  },
  zigzaglevelorder: {
    meta: zigzagLevelOrderMeta,
    source: zigzagLevelOrderSource,
    generateFrames: zigzagLevelOrderFrames,
  },
  rightsideview: {
    meta: rightSideViewMeta,
    source: rightSideViewSource,
    generateFrames: rightSideViewFrames,
  },
  widthofbinarytree: {
    meta: widthOfBinaryTreeMeta,
    source: widthOfBinaryTreeSource,
    generateFrames: widthOfBinaryTreeFrames,
  },
  maxpathsum: {
    meta: maxPathSumMeta,
    source: maxPathSumSource,
    generateFrames: maxPathSumFrames,
  },
  // Heap / Priority Queue
  minheap: {
    meta: minHeapMeta,
    source: minHeapSource,
    generateFrames: minHeapFrames,
  },
};

const TOPIC_DISPLAY_NAMES: Record<string, string> = {
  arrays: "Arrays & Hashing",
  "binary-search": "Binary Search",
  stack: "Stack",
  "sliding-window": "Sliding Window",
  "linked-list": "Linked Lists",
  recursion: "Recursion & DP",
  trees: "Trees & BST",
  heap: "Heap / Priority Queue",
};

/**
 * Dynamically converts all registered problem metas into ProblemInfo objects.
 */
export function getAllProblems(): ProblemInfo[] {
  return Object.entries(PROBLEMS_REGISTRY).map(([key, entry]) => {
    const m = entry.meta;
    return {
      id: key as VisualizerType,
      title: m.title,
      topic: TOPIC_DISPLAY_NAMES[m.topicId] || m.topicId,
      topicId: m.topicId as ProblemInfo["topicId"],
      difficulty: m.difficulty as ProblemInfo["difficulty"],
      description: m.description || "",
      theme: m.theme || "bone" as any,
      tags: m.tags || [],
    };
  });
}

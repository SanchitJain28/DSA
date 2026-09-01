import { type ThemeName } from "@/utils/theme";

export type VisualizerType =
  | "twosum"
  | "containsduplicate"
  | "isanagram"
  | "groupanagrams"
  | "sortedsquares"
  | "threesum"
  | "validsudoku"
  | "longestconsecutive"
  | "searchinsert"
  | "search2dmatrix"
  | "findmin"
  | "searchrotated"
  | "shipwithindays"
  | "kokoeatingbananas"
  | "validparentheses"
  | "dailytemperatures"
  | "nextgreaterelement"
  | "asteroidcollision"
  | "carfleet"
  | "longestcharreplacement"
  | "middlenode"
  | "hascycle"
  | "removenthfromend"
  | "swappairs"
  | "rotatelist"
  | "reorderlist"
  | "partitionlist"
  | "sortlist"
  | "reversestring"
  | "climbstairstree"
  | "climbstairsdp"
  | "preorder"
  | "inorder"
  | "postorder"
  | "invert"
  | "maxdepth"
  | "diameter"
  | "balanced"
  | "sametree"
  | "subtree"
  | "symmetric"
  | "pathsum"
  | "pathsum2"
  | "sumnumbers"
  | "countnodes"
  | "goodnodes"
  | "lca"
  | "isvalidbst"
  | "kthsmallest"
  | "levelorder"
  | "zigzaglevelorder"
  | "rightsideview"
  | "widthofbinarytree"
  | "maxpathsum"
  | "minheap"
  | "treevisualizer";

export interface ProblemInfo {
  id: VisualizerType;
  title: string;
  topic: string;
  topicId:
    | "trees"
    | "linked-list"
    | "arrays"
    | "stack"
    | "binary-search"
    | "sliding-window"
    | "recursion"
    | "heap";
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  theme: ThemeName;
  tags: string[];
}

export interface TopicGroup {
  id: ProblemInfo["topicId"];
  name: string;
  description: string;
  iconName: string;
  theme: ThemeName;
}

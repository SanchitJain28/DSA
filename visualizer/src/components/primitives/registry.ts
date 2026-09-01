import React from "react";
import ArrayPanel from "./ArrayPanel";
import HashMapPanel from "./HashMapPanel";
import MatrixPanel from "./MatrixPanel";
import SetPanel from "./SetPanel";
import RangePanel from "./RangePanel";
import StackPanel from "./StackPanel";
import LinkedListPanel from "./LinkedListPanel";
import TreePanel from "./TreePanel";
import QueuePanel from "./QueuePanel";

export const STRUCTURE_PANELS: Record<string, React.FC<any>> = {
  array: ArrayPanel,
  arrays: ArrayPanel,
  hashmap: HashMapPanel,
  matrix: MatrixPanel,
  set: SetPanel,
  range: RangePanel,
  stack: StackPanel,
  stacks: StackPanel,
  linkedList: LinkedListPanel,
  tree: TreePanel,
  queue: QueuePanel,
};


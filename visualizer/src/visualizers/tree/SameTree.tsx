import { useMemo } from "react";
import { buildStandardTree } from "../../core/tree/buildTree";
import { sameTreeCode } from "../../core/tree/sourcecode/sameTree";
import { generateFrames } from "../../core/tree/frames/sameTreeFrames";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";

export default function SameTree() {
  const frames = useMemo(() => {
    // We build two identical trees for a complete visualization
    const p = buildStandardTree();
    const q = buildStandardTree();
    // Intentionally change a leaf node on Q so it eventually fails!
    // n9 is a leaf of n7. Let's change its value to 99.
    if (q.right?.right) {
      q.right.right.val = 99;
    }
    
    return generateFrames(p, q);
  }, []);

  return (
    <TreeVisualizerLayout
      title="Same Tree"
      theme="teal"
      layout={frames[0].layout!} // Use the precomputed layout from the first frame
      frames={frames}
      code={sameTreeCode}
    />
  );
}

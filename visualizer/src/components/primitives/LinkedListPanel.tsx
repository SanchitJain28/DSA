import { useMemo } from "react";
import LinkedListEdges from "../linked-list/LinkedListEdges";
import LinkedListNodes from "../linked-list/LinkedListNodes";
import type { LinkedListState } from "../../core/structures/linked-list/types";
import type { ThemeName } from "../../utils/theme";

interface LinkedListPanelProps {
  state: LinkedListState;
  theme?: ThemeName;
  colors?: Record<string, string>;
}

export function LinkedListPanel({
  state,
  theme = "bone" as any,
}: LinkedListPanelProps) {
  const nodes = state?.nodes || [];
  const edges = state?.edges || [];
  const pointers = state?.pointers || {};
  const activeNodeId = state?.activeNodeId;

  const { totalWidth, totalHeight, originX, originY } = useMemo(() => {
    const currentNodes = state?.nodes || [];
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const n of currentNodes) {
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    }

    if (minX === Infinity) {
      minX = 0;
      maxX = 400;
      minY = 0;
      maxY = 120;
    }

    const paddingX = 70;
    const paddingY = 60;

    return {
      totalWidth: Math.max(320, maxX - minX + paddingX * 2),
      totalHeight: Math.max(160, maxY - minY + paddingY * 2),
      originX: paddingX - minX,
      originY: paddingY - minY,
    };
  }, [state?.nodes]);

  return (
    <div className="relative flex items-center justify-center select-none bg-transparent font-['Poppins',sans-serif]">
      <div
        className="relative bg-transparent flex items-center justify-center shrink-0"
        style={{
          width: totalWidth,
          height: totalHeight,
        }}
      >
        <div
          style={{
            transform: `translate(${originX}px, ${originY}px)`,
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        >
          <LinkedListEdges edges={edges} theme={theme} />
          <LinkedListNodes
            nodes={nodes}
            pointers={pointers}
            activeNodeId={activeNodeId}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}

export default LinkedListPanel;

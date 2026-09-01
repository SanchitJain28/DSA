import { motion } from "framer-motion";
import type { MatrixState } from "../../core/structures/matrix/types";
import { type ThemeName } from "../../utils/theme";

interface MatrixPanelProps {
  state: MatrixState;
  theme?: ThemeName;
  colors?: Record<string, string>;
}

export function MatrixPanel({
  state,
}: MatrixPanelProps) {
  const {
    grid,
    activeCell,
    activeRow,
    activeCol,
    activeBox,
    conflictCell,
    highlightCells,
  } = state;

  const [activeR, activeC] = activeCell ?? [-1, -1];
  const [conflictR, conflictC] = conflictCell ?? [-1, -1];

  const rowsCount = grid.length;
  const colsCount = grid[0]?.length || 0;
  const isSudoku = rowsCount === 9 && colsCount === 9;

  return (
    <div className="flex flex-col items-center justify-center select-none bg-transparent font-['Poppins',sans-serif]">
      {state.title && (
        <div className="text-[#82828b] text-[11.5px] font-semibold uppercase tracking-[0.1em] mb-2.5">
          {state.title}
        </div>
      )}

      {/* Column labels */}
      <div className="flex items-center ml-8 mb-1.5">
        {Array.from({ length: colsCount }, (_, c) => (
          <div
            key={`col-label-${c}`}
            className={`w-8 sm:w-10 md:w-11 text-center text-[11px] font-['JetBrains_Mono',monospace] font-bold ${
              c === activeCol
                ? "text-[#c9c3b6] font-extrabold"
                : "text-[#6c6c76]"
            }`}
          >
            {c}
          </div>
        ))}
      </div>

      <div className="flex items-center">
        {/* Row labels */}
        <div className="flex flex-col mr-2">
          {Array.from({ length: rowsCount }, (_, r) => (
            <div
              key={`row-label-${r}`}
              className={`h-8 sm:h-10 md:h-11 flex items-center justify-center text-[11px] font-['JetBrains_Mono',monospace] font-bold w-6 ${
                r === activeRow
                  ? "text-[#c9c3b6] font-extrabold"
                : "text-[#6c6c76]"
              }`}
            >
              {r}
            </div>
          ))}
        </div>

        {/* Matrix Grid */}
        <div
          className="grid bg-[#131316] border border-[#26262c] rounded-[12px] p-2 gap-1 shadow-[0_0_0_1px_rgba(255,255,255,0.045)]"
          style={{ gridTemplateColumns: `repeat(${colsCount}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((val, c) => {
              const currentBox = isSudoku
                ? Math.floor(r / 3) * 3 + Math.floor(c / 3)
                : -1;
              const isActive = r === activeR && c === activeC;
              const isConflict = r === conflictR && c === conflictC;
              const isInActiveRow = r === activeRow && !isActive;
              const isInActiveCol = c === activeCol && !isActive;
              const isInActiveBox =
                isSudoku && currentBox === activeBox && !isActive;
              const isHighlighted =
                highlightCells?.some(([hr, hc]) => hr === r && hc === c) &&
                !isActive;
              const isEmpty = val === "." || val === null || val === undefined;

              // 3x3 Subgrid boundary borders for Sudoku
              const isRightBoxBorder = isSudoku && (c === 2 || c === 5);
              const isBottomBoxBorder = isSudoku && (r === 2 || r === 5);

              let cellBg = "bg-[#1c1c21]";
              let cellBorder = "border-[#26262c]";
              let textColor = isEmpty ? "text-[#5a5a63]" : "text-[#ededf0]";
              let cellShadow = "";

              if (isConflict) {
                cellBg = "bg-gradient-to-b from-[#2b1c1c] to-[#1a1010]";
                cellBorder = "border-[#b08a8a]";
                textColor = "text-[#b08a8a]";
                cellShadow = "shadow-[0_0_12px_rgba(176,138,138,0.4)]";
              } else if (isActive) {
                cellBg = "bg-gradient-to-b from-[#302e2a] to-[#201f1c]";
                cellBorder = "border-[#c9c3b6]";
                textColor = "text-white";
                cellShadow = "shadow-[0_0_14px_rgba(201,195,182,0.4)]";
              } else if (isHighlighted) {
                cellBg = "bg-gradient-to-b from-[#18261e] to-[#0e1712]";
                cellBorder = "border-[#7d9b86]/60";
                textColor = "text-[#7d9b86]";
              } else if (isInActiveRow || isInActiveCol || isInActiveBox) {
                cellBg = "bg-[#17171b]";
                cellBorder = "border-[#3d3d45]/40";
                if (!isEmpty) textColor = "text-[#e2ddd2]";
              }

              return (
                <div
                  key={`cell-${r}-${c}`}
                  className={`relative flex items-center justify-center ${
                    isRightBoxBorder ? "mr-1.5" : ""
                  } ${isBottomBoxBorder ? "mb-1.5" : ""}`}
                >
                  <motion.div
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                      scale: isActive ? 1.08 : isConflict ? 1.1 : 1,
                      opacity: 1,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-[8px] border flex items-center justify-center font-['JetBrains_Mono',monospace] font-bold text-sm sm:text-base md:text-lg transition-colors duration-150 ${cellBg} ${cellBorder} ${textColor} ${cellShadow} ${
                      isActive ? "z-20 ring-1 ring-[#c9c3b6]/50" : isConflict ? "z-20 ring-1 ring-[#b08a8a]/50" : "z-10"
                    }`}
                  >
                    {isEmpty ? (
                      <span className="opacity-20 text-xs font-normal">·</span>
                    ) : (
                      String(val)
                    )}
                  </motion.div>
                </div>
              );
            }),
          )}
        </div>
      </div>

      {/* Helper Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[11px] font-['JetBrains_Mono',monospace] text-[#82828b]">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-[4px] border border-[#c9c3b6] bg-[#302e2a]" />
          <span>Active Cell</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-[4px] border border-[#3d3d45] bg-[#17171b]" />
          <span>Active Row / Col / Box</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-[4px] border border-[#b08a8a] bg-[#2b1c1c]" />
          <span>Conflict / Duplicate</span>
        </div>
      </div>
    </div>
  );
}

export default MatrixPanel;

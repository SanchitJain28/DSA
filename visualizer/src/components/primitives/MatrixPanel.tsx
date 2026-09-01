import { motion } from "framer-motion";
import type { MatrixState } from "../../core/structures/matrix/types";
import { themeColors, type ThemeName } from "../../utils/theme";

interface MatrixPanelProps {
  state: MatrixState;
  theme?: ThemeName;
  colors?: Record<string, string>;
}

export function MatrixPanel({
  state,
  theme = "amber",
  colors: customColors,
}: MatrixPanelProps) {
  const colors = customColors || themeColors[theme] || themeColors.amber;
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
    <div className="flex flex-col items-center justify-center select-none bg-transparent">
      {state.title && (
        <div className="text-neutral-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
          {state.title}
        </div>
      )}

      {/* Column labels */}
      <div className="flex items-center ml-8 mb-1">
        {Array.from({ length: colsCount }, (_, c) => (
          <div
            key={`col-label-${c}`}
            className={`w-8 sm:w-10 md:w-11 text-center text-xs font-mono font-bold ${
              c === activeCol
                ? `${colors.titleClass} font-extrabold`
                : "text-neutral-500"
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
              className={`h-8 sm:h-10 md:h-11 flex items-center justify-center text-xs font-mono font-bold w-6 ${
                r === activeRow
                  ? `${colors.titleClass} font-extrabold`
                  : "text-neutral-500"
              }`}
            >
              {r}
            </div>
          ))}
        </div>

        {/* Matrix Grid */}
        <div
          className={`grid bg-neutral-950/80 border border-neutral-800 rounded-md p-1.5 gap-0.5 shadow-md`}
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

              let cellBg = "bg-neutral-900/60";
              let cellBorder = "border-neutral-800";
              let textColor = isEmpty ? "text-neutral-600" : "text-neutral-200";

              if (isConflict) {
                cellBg = "bg-rose-950/90";
                cellBorder = "border-rose-500";
                textColor = "text-rose-200";
              } else if (isActive) {
                cellBg = "bg-amber-500/25";
                cellBorder = "border-amber-400";
                textColor = "text-amber-300";
              } else if (isHighlighted) {
                cellBg = "bg-indigo-950/40";
                cellBorder = "border-indigo-500/50";
                if (!isEmpty) textColor = "text-indigo-200";
              } else if (isInActiveRow || isInActiveCol || isInActiveBox) {
                cellBg = "bg-sky-950/40";
                cellBorder = "border-sky-800/50";
                if (!isEmpty) textColor = "text-sky-200";
              }

              return (
                <div
                  key={`cell-${r}-${c}`}
                  className={`relative flex items-center justify-center ${
                    isRightBoxBorder ? "mr-1" : ""
                  } ${isBottomBoxBorder ? "mb-1" : ""}`}
                >
                  <motion.div
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                      scale: isActive ? 1.12 : isConflict ? 1.15 : 1,
                      opacity: 1,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-md border flex items-center justify-center font-mono font-bold text-sm sm:text-base md:text-lg transition-colors duration-150 ${cellBg} ${cellBorder} ${textColor} ${
                      isActive ? "ring-2 ring-amber-400 shadow-lg z-20" : ""
                    } ${
                      isConflict
                        ? "ring-2 ring-rose-500 shadow-rose-900/50 shadow-lg z-20"
                        : "z-10"
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
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded border border-amber-400 bg-amber-500/30 ring-1 ring-amber-400" />
          <span>Active Cell (r, c)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded border border-sky-800/50 bg-sky-950/40" />
          <span>Active Row / Col / Box</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded border border-rose-500 bg-rose-950/90 ring-1 ring-rose-500" />
          <span>Conflict / Duplicate</span>
        </div>
      </div>
    </div>
  );
}

export default MatrixPanel;

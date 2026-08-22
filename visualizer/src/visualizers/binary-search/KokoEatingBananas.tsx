import { useMemo, useState } from "react";
import BinarySearchVisualizerLayout from "../../components/layout/BinarySearchVisualizerLayout";
import SearchRangeGraph from "../../components/binary-search/SearchRangeGraph";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames, type KokoFrame } from "../../core/binary-search/frames/kokoEatingBananasFrames";
import { kokoEatingBananasCode } from "../../core/binary-search/sourcecode/kokoEatingBananas";
import { ArrayRenderer } from "../../components/shared/ArrayRenderer";
import { themeColors } from "../../utils/theme";
import { Clock, Layers, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface KokoData {
  piles: number[];
  h: number;
}

type KokoTestCase = TestCase<KokoData>;

const TEST_CASES: KokoTestCase[] = [
  {
    id: "tc1",
    name: "Classic: [3, 6, 7, 11], h = 8 (Speed = 4)",
    data: {
      piles: [3, 6, 7, 11],
      h: 8,
    },
  },
  {
    id: "tc2",
    name: "Large Mix: [30, 11, 23, 4, 20], h = 5 (Speed = 30)",
    data: {
      piles: [30, 11, 23, 4, 20],
      h: 5,
    },
  },
  {
    id: "tc3",
    name: "Medium Deadline: [30, 11, 23, 4, 20], h = 6 (Speed = 23)",
    data: {
      piles: [30, 11, 23, 4, 20],
      h: 6,
    },
  },
  {
    id: "tc4",
    name: "Tight Deadline: [3, 6, 7, 11], h = 4 (Speed = 11)",
    data: {
      piles: [3, 6, 7, 11],
      h: 4,
    },
  },
  {
    id: "tc5",
    name: "Generous Time: [1, 2, 3], h = 100 (Speed = 1)",
    data: {
      piles: [1, 2, 3],
      h: 100,
    },
  },
  {
    id: "tc6",
    name: "Single Large Pile: [100], h = 10 (Speed = 10)",
    data: {
      piles: [100],
      h: 10,
    },
  },
];

export default function KokoEatingBananas() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<KokoData>(
    TEST_CASES[0].data!
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer state for custom inputs in modal
  const [tempPilesInput, setTempPilesInput] = useState(
    `[${TEST_CASES[0].data!.piles.join(", ")}]`
  );
  const [tempHInput, setTempHInput] = useState(
    String(TEST_CASES[0].data!.h)
  );

  const modal = useConfigModal(0);
  const colors = themeColors.amber;

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempPilesInput(`[${currentData.piles.join(", ")}]`);
      setTempHInput(String(currentData.h));
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempPilesInput(`[${tc.data.piles.join(", ")}]`);
        setTempHInput(String(tc.data.h));
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let piles = currentData.piles;
      let h = currentData.h;

      if (tempPilesInput.trim()) {
        const parsed = tempPilesInput
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x) && x > 0);

        if (parsed.length > 0) {
          piles = parsed;
        }
      }

      const parsedH = Number(tempHInput);
      if (!isNaN(parsedH) && parsedH > 0) {
        h = parsedH;
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ piles, h });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.piles, currentData.h);
  }, [currentData.piles, currentData.h]);

  const maxPile = Math.max(...currentData.piles, 1);

  return (
    <BinarySearchVisualizerLayout
      title="Koko Eating Bananas"
      theme="amber"
      frames={frames}
      code={kokoEatingBananasCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      renderCanvasContent={(frame: KokoFrame) => {
        const leftVal = frame.leftSpeed;
        const rightVal = frame.rightSpeed;
        const midVal = frame.midSpeed ?? undefined;
        const isFeasible = frame.status === "feasible" || frame.status === "found";
        const hasEvaluated = frame.totalHours !== null;

        return (
          <div className="flex flex-col items-center gap-6 select-none w-fit pb-6">
            {/* 1. Eating Speed Search Space Range */}
            <SearchRangeGraph
              min={1}
              max={maxPile}
              left={leftVal}
              right={rightVal}
              mid={midVal}
              isMatch={isFeasible}
              unit=" /hr"
              theme="amber"
              className="w-[560px]"
            />

            {/* 2. Standard Array of Banana Piles */}
            <div className="flex flex-col items-center gap-3">
              {frame.arrays?.map((arr) => (
                <ArrayRenderer
                  key={arr.id}
                  arr={arr}
                  frame={frame}
                  colors={colors}
                />
              ))}
            </div>

            {/* 3. Pile-by-Pile Hours Breakdown */}
            {hasEvaluated && midVal !== undefined && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-transparent border border-neutral-800/80 rounded-md p-4 flex flex-col gap-3 w-[560px] shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                      Hours Breakdown @ Speed k = {midVal}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono">
                    <span className="text-neutral-400">Allowed Deadline: </span>
                    <strong className="text-amber-400">{frame.h} hrs</strong>
                  </div>
                </div>

                {/* Per-pile breakdown calculation pills */}
                <div className="flex items-center justify-center gap-2 flex-wrap py-1">
                  {currentData.piles.map((pile, idx) => {
                    const hrs = Math.ceil(pile / midVal);
                    return (
                      <div
                        key={`pile-calc-${idx}`}
                        className="bg-neutral-900/80 border border-neutral-800 rounded px-2.5 py-1.5 flex flex-col items-center text-xs font-mono"
                      >
                        <span className="text-[10px] text-neutral-500">Pile #{idx} ({pile})</span>
                        <span className="text-neutral-200 font-semibold mt-0.5">
                          ⌈{pile} / {midVal}⌉ = <strong className="text-amber-300">{hrs}h</strong>
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Total sum vs deadline comparison bar */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/50 text-xs font-mono">
                  <div className="text-neutral-300">
                    Total Time: <strong className="text-neutral-100">{frame.totalHours} hrs</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {frame.totalHours! <= frame.h ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Feasible ({frame.totalHours} ≤ {frame.h}h)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500 text-rose-300 font-bold">
                        Too Slow ({frame.totalHours} &gt; {frame.h}h)
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        );
      }}
    >
      <ConfigModal
        title="Configure Banana Piles & Deadline"
        description="Select a preset scenario or customize banana piles array and deadline hours limit."
        theme="amber"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `h: ${tc.data!.h} hrs · Piles: [${tc.data!.piles.join(", ")}]`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <label className="text-xs font-mono font-semibold text-neutral-300">
                Banana Piles (comma-separated integers)
              </label>
            </div>
            <input
              type="text"
              value={tempPilesInput}
              onChange={(e) => setTempPilesInput(e.target.value)}
              placeholder="3, 6, 7, 11"
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-md px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500/80"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <label className="text-xs font-mono font-semibold text-neutral-300">
                Deadline Hours Limit (h)
              </label>
            </div>
            <input
              type="number"
              value={tempHInput}
              onChange={(e) => setTempHInput(e.target.value)}
              placeholder="8"
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-md px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500/80"
            />
          </div>
        </div>
      </ConfigModal>
    </BinarySearchVisualizerLayout>
  );
}

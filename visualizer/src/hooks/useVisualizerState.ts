import { useState, useCallback } from "react";
import { useConfigModal } from "./useConfigModal";
import { usePlaybackTimer } from "./usePlaybackTimer";
import { useKeyboardControls } from "./useKeyboardControls";
import type { TestCase, InputFieldDef } from "../core/shared/types";

export interface UseVisualizerStateOptions<T> {
  testCases: TestCase<T>[];
  inputSchema?: InputFieldDef[];
  totalFrames: number;
}

export function useVisualizerState<T = any>({
  testCases,
  inputSchema = [],
  totalFrames,
}: UseVisualizerStateOptions<T>) {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<T>(
    testCases[0]?.data ?? ({} as T),
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer state for custom inputs inside ConfigModal
  const [formBuffers, setFormBuffers] = useState<Record<string, string>>(() => {
    return initFormBuffers(testCases[0]?.data, inputSchema);
  });

  const modal = useConfigModal(0);

  // Playback timer & keyboard shortcuts
  usePlaybackTimer(isPlaying, setIsPlaying, currentIdx, setCurrentIdx, totalFrames);
  useKeyboardControls(totalFrames, setCurrentIdx, setIsPlaying);

  const handleNext = useCallback(() => {
    setCurrentIdx((p) => Math.min(p + 1, Math.max(0, totalFrames - 1)));
  }, [totalFrames]);

  const handlePrev = useCallback(() => {
    setCurrentIdx((p) => Math.max(p - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setCurrentIdx(0);
    setIsPlaying(false);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const handleOpenModal = useCallback(() => {
    modal.openModal(() => {
      setFormBuffers(initFormBuffers(currentData, inputSchema));
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  }, [currentData, inputSchema, modal, testCaseIdx]);

  const handleSelectPreset = useCallback(
    (idx: number) => {
      modal.selectPreset(idx, () => {
        const tc = testCases[idx];
        if (tc?.data) {
          setFormBuffers(initFormBuffers(tc.data, inputSchema));
        }
      });
    },
    [modal, testCases, inputSchema],
  );

  const handleApplySettings = useCallback(() => {
    modal.apply(() => {
      let nextData = { ...currentData } as any;

      if (modal.selectedPresetIdx !== null && testCases[modal.selectedPresetIdx]) {
        setTestCaseIdx(modal.selectedPresetIdx);
        nextData = testCases[modal.selectedPresetIdx].data;
      } else if (inputSchema.length > 0) {
        // Parse custom inputs according to schema
        nextData = parseCustomInputs(formBuffers, inputSchema, currentData);
      }

      setCurrentData(nextData);
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  }, [modal, testCases, inputSchema, formBuffers, currentData]);

  const setFieldValue = useCallback((key: string, value: string) => {
    setFormBuffers((prev) => ({ ...prev, [key]: value }));
    modal.setSelectedPresetIdx(null);
  }, [modal]);

  return {
    testCaseIdx,
    currentData,
    currentIdx,
    setCurrentIdx,
    isPlaying,
    setIsPlaying,
    formBuffers,
    setFieldValue,
    handleNext,
    handlePrev,
    handleReset,
    handlePlayPause,
    modal: {
      isOpen: modal.isOpen,
      setIsOpen: modal.setIsOpen,
      selectedPresetIdx: modal.selectedPresetIdx,
      onOpen: handleOpenModal,
      onSelectPreset: handleSelectPreset,
      onApply: handleApplySettings,
    },
  };
}

function initFormBuffers(data: any, schema: InputFieldDef[]): Record<string, string> {
  const buffers: Record<string, string> = {};
  if (!data || typeof data !== "object") return buffers;

  for (const field of schema) {
    const val = data[field.key];
    if (val === undefined || val === null) {
      buffers[field.key] = "";
    } else if (field.type === "matrix" || (Array.isArray(val) && val.length > 0 && Array.isArray(val[0]))) {
      buffers[field.key] = JSON.stringify(val);
    } else if (Array.isArray(val)) {
      buffers[field.key] = `[${val.map((x) => (typeof x === "string" ? `"${x}"` : String(x))).join(", ")}]`;
    } else {
      buffers[field.key] = String(val);
    }
  }
  return buffers;
}

function parseCustomInputs(
  buffers: Record<string, string>,
  schema: InputFieldDef[],
  fallbackData: any,
): any {
  const result: any = { ...fallbackData };

  for (const field of schema) {
    const rawVal = buffers[field.key]?.trim();
    if (rawVal === undefined || rawVal === "") continue;

    if (field.type === "number") {
      const num = Number(rawVal);
      if (!isNaN(num)) result[field.key] = num;
    } else if (field.type === "matrix") {
      try {
        const parsed = JSON.parse(rawVal);
        if (Array.isArray(parsed)) result[field.key] = parsed;
      } catch {
        // keep fallback
      }
    } else if (field.type === "array") {
      const cleaned = rawVal.replace(/^\[/, "").replace(/\]$/, "").trim();
      if (!cleaned) {
        result[field.key] = [];
      } else {
        const items = cleaned.split(",").map((s) => s.trim());
        const isNumeric = items.every((s) => !isNaN(Number(s)));
        if (isNumeric) {
          result[field.key] = items.map(Number);
        } else {
          result[field.key] = items.map((s) => s.replace(/^["']/, "").replace(/["']$/, ""));
        }
      }
    } else {
      result[field.key] = rawVal;
    }
  }

  return result;
}

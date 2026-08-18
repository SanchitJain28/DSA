import { useState, useCallback } from "react";

export interface UseConfigModalReturn {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openModal: (callback?: () => void) => void;
  closeModal: () => void;
  selectedPresetIdx: number | null;
  setSelectedPresetIdx: (idx: number | null) => void;
  selectPreset: (idx: number, callback?: (idx: number) => void) => void;
  apply: (callback: () => void) => void;
}

export function useConfigModal(initialPresetIdx: number | null = 0): UseConfigModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number | null>(initialPresetIdx);

  const openModal = useCallback((callback?: () => void) => {
    if (callback) callback();
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const selectPreset = useCallback((idx: number, callback?: (idx: number) => void) => {
    setSelectedPresetIdx(idx);
    if (callback) callback(idx);
  }, []);

  const apply = useCallback((callback: () => void) => {
    callback();
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    setIsOpen,
    openModal,
    closeModal,
    selectedPresetIdx,
    setSelectedPresetIdx,
    selectPreset,
    apply,
  };
}

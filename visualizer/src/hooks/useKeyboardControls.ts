import { useEffect } from "react";

export function useKeyboardControls(
  framesLength: number,
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIdx((p) => Math.min(p + 1, framesLength - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIdx((p) => Math.max(p - 1, 0));
      } else if (e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        setIsPlaying((p) => !p);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [framesLength, setCurrentIdx, setIsPlaying]);
}

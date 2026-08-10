import { useEffect } from "react";

export function usePlaybackTimer(
  isPlaying: boolean,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  currentIdx: number,
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>,
  framesLength: number
) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying && currentIdx < framesLength - 1) {
      timer = setTimeout(() => setCurrentIdx((prev) => prev + 1), 800);
    } else if (currentIdx >= framesLength - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentIdx, framesLength, setIsPlaying, setCurrentIdx]);
}

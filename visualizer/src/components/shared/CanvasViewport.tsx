import React, { useRef, useState, useCallback, useEffect } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";

interface CanvasViewportProps {
  children: React.ReactNode;
  className?: string;
  minZoom?: number;
  maxZoom?: number;
  showControls?: boolean;
}

export default function CanvasViewport({
  children,
  className = "",
  minZoom = 0.4,
  maxZoom = 2.5,
  showControls = true,
}: CanvasViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const posStartRef = useRef({ x: 0, y: 0 });

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = -e.deltaY * 0.0015;
      setScale((prevScale) => {
        const newScale = Math.min(
          maxZoom,
          Math.max(minZoom, prevScale + zoomFactor * prevScale)
        );
        return Number(newScale.toFixed(3));
      });
    },
    [minZoom, maxZoom]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  // Pan / Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.tagName === "INPUT" ||
      target.tagName === "SELECT" ||
      target.closest("button") ||
      target.closest("input") ||
      target.closest(".recharts-responsive-container") ||
      target.closest(".interactive-element")
    ) {
      return;
    }

    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { x: position.x, y: position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPosition({
      x: posStartRef.current.x + dx,
      y: posStartRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setScale((s) => Math.min(maxZoom, Number((s + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    setScale((s) => Math.max(minZoom, Number((s - 0.15).toFixed(2))));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full overflow-hidden select-none bg-[#141519] ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: "36px 36px",
        backgroundPosition: `${position.x}px ${position.y}px`,
      }}
    >
      {/* Pannable & Zoomable Transform Container */}
      <div
        className="w-full h-full transition-transform duration-75 ease-out origin-center flex flex-col items-center justify-center pointer-events-auto"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
        }}
      >
        {children}
      </div>

      {/* Floating Canvas Zoom Controls */}
      {showControls && (
        <div className="absolute bottom-3.5 right-4 z-20 flex items-center gap-1 bg-[#141417] p-1 rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-[#1e1e23]">
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 text-[#f2f2f5] bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.4)] hover:from-[#3a3a42] hover:to-[#2c2c33] rounded-[6px] cursor-pointer transition-all active:scale-95"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="font-['JetBrains_Mono',monospace] text-[11px] px-2 py-0.5 text-[#8a8a93] min-w-[44px] text-center font-medium">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 text-[#f2f2f5] bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.4)] hover:from-[#3a3a42] hover:to-[#2c2c33] rounded-[6px] cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3.5 bg-[#26262c] mx-0.5" />

          <button
            type="button"
            onClick={handleReset}
            title="Reset View"
            className="p-1.5 text-[#8a8a93] hover:text-[#ededf0] hover:bg-[#1c1c20] rounded-[6px] cursor-pointer transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

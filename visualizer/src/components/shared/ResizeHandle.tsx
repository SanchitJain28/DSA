import { Separator as PanelResizeHandle } from "react-resizable-panels";

export default function ResizeHandle() {
  return (
    <PanelResizeHandle className="w-2 flex items-center justify-center cursor-col-resize group mx-1">
      <div className="w-0.5 h-1/3 bg-gray-800 group-hover:bg-fuchsia-500 transition-colors rounded-full" />
    </PanelResizeHandle>
  );
}

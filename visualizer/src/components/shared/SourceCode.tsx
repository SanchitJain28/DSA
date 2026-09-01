import { useEffect, useRef } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { type ThemeName } from "../../utils/theme";

interface SourceCodeProps {
  code: { line: number; text: string }[];
  activeLine: number;
  theme?: ThemeName;
}

export default function SourceCode({
  code,
  activeLine,
  theme = "bone" as any,
}: SourceCodeProps) {
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<any[]>([]);

  const codeString = code.map((c) => c.text).join("\n");

  // Find the exact 1-based index in the array to map to Monaco's line numbers
  const monacoActiveLineIndex =
    code.findIndex((c) => c.line === activeLine) + 1;

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (editorRef.current && monaco && monacoActiveLineIndex > 0) {
      decorationsRef.current = editorRef.current.deltaDecorations(
        decorationsRef.current,
        [
          {
            range: new monaco.Range(
              monacoActiveLineIndex,
              1,
              monacoActiveLineIndex,
              1
            ),
            options: {
              isWholeLine: true,
              className: `monaco-active-line-${theme}`,
            },
          },
        ]
      );
      editorRef.current.revealLineInCenter(monacoActiveLineIndex);
    }
  }, [monacoActiveLineIndex, monaco, theme]);

  return (
    <div className="h-full flex flex-col font-['Poppins',sans-serif]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#a8a296]">
          02 — Source Code
        </span>
      </div>
      <div className="flex-1 overflow-hidden rounded-[14px] bg-[#141519] border border-white/[0.05] p-2">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          theme="vs-dark"
          value={codeString}
          onMount={handleEditorDidMount}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            lineHeight: 22,
            fontFamily: "'JetBrains Mono', monospace",
            domReadOnly: true,
            padding: { top: 12, bottom: 12 },
            lineNumbersMinChars: 3,
            renderLineHighlight: "none",
          }}
        />
      </div>
    </div>
  );
}

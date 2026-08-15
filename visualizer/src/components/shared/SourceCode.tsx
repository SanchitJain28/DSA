import { useEffect, useRef } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { type ThemeName } from "../../utils/theme";

interface SourceCodeProps {
  code: { line: number; text: string }[];
  activeLine: number;
  theme?: ThemeName;
}

export default function SourceCode({ code, activeLine, theme = "cyan" }: SourceCodeProps) {
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
              1,
            ),
            options: {
              isWholeLine: true,
              className: `monaco-active-line-${theme}`,
            },
          },
        ],
      );
      editorRef.current.revealLineInCenter(monacoActiveLineIndex);
    }
  }, [monacoActiveLineIndex, monaco, theme]);

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-muted-foreground text-sm font-bold mb-2 uppercase tracking-wider">
        Source Code
      </h3>
      <div className="flex-1 overflow-hidden rounded-xl border border-border shadow-inner">
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
            fontSize: 14,
            domReadOnly: true,
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>
    </div>
  );
}

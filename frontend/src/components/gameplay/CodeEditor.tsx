import { useRef } from "react";
import type monaco from "monaco-editor";
import { Editor } from "@monaco-editor/react";
import { engToKor } from "korsearch";

interface CodeEditorProps {
  editorCode: string;
  setEditorCode: React.Dispatch<React.SetStateAction<string>>;
  options?: {
    fontSize?: number;
    isReverse?: boolean;
  };
}

const CodeEditor: React.FC<CodeEditorProps> = ({ editorCode, setEditorCode, options }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>();

  return (
    <Editor
      language="javascript"
      onChange={value => {
        setEditorCode(options?.isReverse ? engToKor(value ?? "") : value ?? "");
      }}
      value={editorCode}
      onMount={(editor, monaco) => {
        editorRef.current = editor;
        import("../../assets/theme/EditorTheme.json").then(data => {
          monaco.editor.defineTheme("myTheme", data as monaco.editor.IStandaloneThemeData);
          monaco.editor.setTheme("myTheme");
        });
      }}
      options={{
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 0,
          horizontalScrollbarSize: 0,
        },
        fontSize: options?.fontSize ?? 16,
        fontFamily: "Cafe24Ssurround",
        lineNumbersMinChars: 3,
        wordBasedSuggestions: false,
        quickSuggestions: false,
      }}
    ></Editor>
  );
};

export default CodeEditor;

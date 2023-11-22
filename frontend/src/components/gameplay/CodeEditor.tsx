import { useEffect, useRef, useState } from "react";
import type monaco from "monaco-editor";
import { Editor } from "@monaco-editor/react";
import { engToKor, korToEng } from "korsearch";

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
  const currentPosRef = useRef<monaco.Position | null>();
  return (
    <Editor
      language="javascript"
      value={editorCode}
      onMount={(editor, monaco) => {
        editorRef.current = editor;
        import("../../assets/theme/EditorTheme.json").then(data => {
          monaco.editor.defineTheme("myTheme", data as monaco.editor.IStandaloneThemeData);
          monaco.editor.setTheme("myTheme");
        });

        editor.onDidChangeCursorPosition(e => {
          if (e.source === "modelChange") {
            editor.setPosition(currentPosRef.current ?? e.position);
          }
        });
      }}
      onChange={value => {
        if (!options?.isReverse) {
          setEditorCode(value ?? "");
        } else {
          currentPosRef.current = editorRef.current?.getPosition();
          setEditorCode(engToKor(korToEng(value ?? "")));
        }
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

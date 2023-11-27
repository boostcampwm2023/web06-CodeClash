import { useEffect, useRef, useState } from "react";
import type monaco from "monaco-editor";
import { Editor, Monaco } from "@monaco-editor/react";
import { engToKor, korToEng } from "korsearch";
import { IKeyboardEvent } from "monaco-editor";
import convertRemToPixels from "../../utils/convertRemToPixels";

interface CodeEditorProps {
  editorCode: string;
  setEditorCode: React.Dispatch<React.SetStateAction<string>>;
  options?: {
    fontSize?: number;
    isReverse?: boolean;
    isTypeRandom?: boolean;
  };
}

const isInputValue = (code: number) => {
  if (code >= 48 && code <= 90) {
    return true;
  }
  if (code >= 96 && code <= 111) {
    return true;
  }
  if (code >= 188) {
    return true;
  }
  return false;
};

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const editorOptions = {
  minimap: {
    enabled: false,
  },
  scrollbar: {
    verticalScrollbarSize: 0,
    horizontalScrollbarSize: 0,
  },
  fontFamily: "Cafe24Ssurround",
  lineNumbersMinChars: 3,
  quickSuggestions: false,
  wordBasedSuggestions: false,
};

const CodeEditor: React.FC<CodeEditorProps> = ({ editorCode, setEditorCode, options }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const currentPosRef = useRef<monaco.Position | null>();

  useEffect(() => {
    const randomKeydownHandler = (e: IKeyboardEvent) => {
      if (isInputValue(e.browserEvent.keyCode) && options?.isTypeRandom) {
        const randomCode = Math.floor(Math.random() * 2);
        if (!randomCode) {
          e.preventDefault();
          e.stopPropagation();
          const randomChar = characters[Math.floor(Math.random() * characters.length)];
          editorRef.current?.trigger("keyboard", "type", { text: randomChar });
        }
      }
    };

    const disposable = editorRef.current?.onKeyDown(randomKeydownHandler);
    return () => {
      disposable?.dispose();
    };
  }, [options?.isTypeRandom]);

  const editorChangeHandler = (value?: string) => {
    if (!options?.isReverse) {
      setEditorCode(value ?? "");
    } else {
      currentPosRef.current = editorRef.current?.getPosition();
      setEditorCode(engToKor(korToEng(value ?? "")));
    }
  };

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
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
  };

  return (
    <Editor
      language="javascript"
      value={editorCode}
      onMount={handleEditorDidMount}
      onChange={editorChangeHandler}
      options={{ ...editorOptions, fontSize: options?.fontSize ?? 16 }}
    ></Editor>
  );
};

export default CodeEditor;

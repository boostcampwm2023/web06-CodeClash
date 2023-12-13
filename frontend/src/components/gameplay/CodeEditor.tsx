import { useEffect, useRef } from "react";
import type monaco from "monaco-editor";
import { Editor, Monaco } from "@monaco-editor/react";
import { engToKor, korToEng } from "korsearch";
import { IKeyboardEvent } from "monaco-editor";

const OriginalResizeObserver = window.ResizeObserver;

window.ResizeObserver = function (callback: any) {
  const wrappedCallback = (entries: any, observer: any) => {
    window.requestAnimationFrame(() => {
      callback(entries, observer);
    });
  };

  // Create an instance of the original ResizeObserver
  // with the wrapped callback
  return new OriginalResizeObserver(wrappedCallback);
} as any;

for (let staticMethod in OriginalResizeObserver) {
  if (OriginalResizeObserver.hasOwnProperty(staticMethod)) {
    window.ResizeObserver[staticMethod as keyof typeof OriginalResizeObserver] = OriginalResizeObserver[
      staticMethod as keyof typeof OriginalResizeObserver
    ] as any;
  }
}

interface CodeEditorProps {
  editorCode: string;
  setEditorCode: React.Dispatch<React.SetStateAction<string>>;
  options?: {
    fontSize?: number;
    isReverseLanguage?: boolean;
    isTypeRandom?: boolean;
    undo?: boolean;
    isInputDelay?: boolean;
  };
  initialCode: string;
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

const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
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
  suggest: {
    selectionMode: "never",
  },
};

const CodeEditor: React.FC<CodeEditorProps> = ({ editorCode, setEditorCode, options, initialCode }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const currentPosRef = useRef<monaco.Position | null>();

  useEffect(() => {
    const handleInputDelay = (e: IKeyboardEvent) => {
      console.log(e);
      if (isInputValue(e.browserEvent.keyCode) && options?.isInputDelay && e.browserEvent.key !== "Process") {
        e.preventDefault();
        e.stopPropagation();
        console.log(e.browserEvent.key);
        setTimeout(() => {
          editorRef.current?.trigger("keyboard", "type", { text: e.browserEvent.key });
        }, 1000);
      }
    };
    const disposable = editorRef.current?.onKeyDown(handleInputDelay);
    return () => {
      disposable?.dispose();
    };
  }, [options?.isInputDelay]);

  useEffect(() => {
    if (options?.undo) {
      Array(5)
        .fill(0)
        .forEach(() => {
          editorRef.current?.trigger("keyboard", "undo", null);
        });
    }
  }, [options?.undo]);

  useEffect(() => {
    const randomKeydownHandler = (e: IKeyboardEvent) => {
      if (isInputValue(e.browserEvent.keyCode) && options?.isTypeRandom && e.browserEvent.key !== "Process") {
        const randomCode = Math.floor(Math.random() * 4);
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
    if (!options?.isReverseLanguage) {
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

    editor.setValue(initialCode);
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

import GameDefaultBox from "./GameDefaultBox";
import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import type monaco from "monaco-editor";

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

const GamePlayBox: React.FC = () => {
  const [problemBoxWidth, setProblemBoxWidth] = useState<number>(35);
  const [codeBoxHeight, setCodeBoxHeight] = useState<number>(70);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>();

  return (
    <div className="flex flex-row w-full h-full">
      <div
        style={{
          width: `${problemBoxWidth}%`,
        }}
      >
        <GameDefaultBox>
          <div></div>
        </GameDefaultBox>
      </div>

      <div
        className="w-2 flex items-center justify-center cursor-pointer"
        onDrag={e => {
          if (e.clientX > 0 && e.clientX < window.innerWidth) setProblemBoxWidth((e.clientX / window.innerWidth) * 100);
        }}
      ></div>
      <div
        className="flex flex-col w-full h-full"
        style={{
          width: `${100 - problemBoxWidth}%`,
        }}
      >
        <div
          style={{
            height: `${codeBoxHeight}%`,
          }}
        >
          <GameDefaultBox>
            <Editor
              language="javascript"
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
                fontFamily: "Cafe24Ssurround",
                lineNumbersMinChars: 3,
                autoIndent: "none",
                wordBasedSuggestions: false,
                quickSuggestions: false,
              }}
            ></Editor>
          </GameDefaultBox>
        </div>
        <div
          className="h-2 items-center justify-center cursor-pointer"
          onDrag={e => {
            console.log(e.clientY);
            if (e.clientY > 0 && e.clientY < window.innerHeight)
              setCodeBoxHeight((e.clientY / window.innerHeight) * 100);
          }}
        ></div>
        <div
          style={{
            height: `${100 - codeBoxHeight}%`,
          }}
        >
          <GameDefaultBox>
            <div></div>
          </GameDefaultBox>
        </div>
      </div>
    </div>
  );
};

export default GamePlayBox;

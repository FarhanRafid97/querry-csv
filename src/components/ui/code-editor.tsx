import type { FC } from "react";
import { cn } from "@/lib/utils";
import { Editor, type EditorProps, loader } from "@monaco-editor/react";
import { useDarkMode } from "@/hooks/use-dark-mode";

loader.init().then((monaco) => {
  monaco.editor.defineTheme("tr-light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#ffffff",
    },
  });

  monaco.editor.defineTheme("tr-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#00000000",
    },
  });
});

export const CodeEditor: FC<EditorProps> = ({
  options,
  className,
  ...props
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <Editor
      className={cn(className)}
      theme={isDarkMode ? "tr-dark" : "tr-light"}
      options={{
        fontLigatures: true,
        fontFamily: "JetBrains Mono",
        minimap: {
          enabled: false,
        },
        ...options,
      }}
      {...props}
    />
  );
};

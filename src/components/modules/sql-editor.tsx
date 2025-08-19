import { useEffect, useRef } from "react";
import { CodeEditor } from "../ui/code-editor";
import type { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { getKeyCombo } from "@/lib/utils";

const SQLEditor = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    editor.onKeyDown((e) => {
      const combo = getKeyCombo(e);
      console.log(combo);
      console.log(e.code);
      if (combo === "Ctrl+3") {
        console.log("Ctrl+3 asdas");
        e.preventDefault();
        e.stopPropagation();
        const selection = editor.getSelection();

        let queryToExecute = "";

        if (selection && !selection.isEmpty()) {
          // Execute selected text
          queryToExecute = editor.getModel()?.getValueInRange(selection) || "";
        }
        console.log(queryToExecute);
        alert(queryToExecute);
      }
    });
  };

  const getSelectedText = (): string => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      if (selection) {
        const selectedText =
          editorRef.current.getModel()?.getValueInRange(selection) || "";
        console.log("Selected text:", selectedText);
        return selectedText;
      }
    }
    return "";
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        // You can call getSelectedText() or any other function here
        const selectedText = getSelectedText();
        alert(selectedText);
        // For now, just log it
        console.log("Cmd/Ctrl+Enter pressed. Selected text:", selectedText);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <CodeEditor
      className="h-full min-h-[50vh] pt-2"
      defaultLanguage="sql"
      defaultValue="// some comment"
      onMount={handleEditorDidMount}
    />
  );
};

export default SQLEditor;

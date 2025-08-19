import { CodeEditor } from "../ui/code-editor";

const SQLEditor = () => {
  return (
    <CodeEditor
      className="h-full min-h-[50vh]"
      defaultLanguage="sql"
      defaultValue="// some comment"
    />
  );
};

export default SQLEditor;

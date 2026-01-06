import Renderer from "./Renderer";
import { useEffect, useRef } from "react";
import { Debugger } from "./Debugger";

export function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef_ = useRef<Renderer>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const editor = new Renderer();
    editorRef_.current = editor;

    container.replaceChildren(editor.canvas);

    return () => editor.cleanup();
  }, []);

  const handleCreateElement_ = () => {
    editorRef_.current?.handleCreateElement();
  };

  return (
    <>
      <Debugger
        tools={{
          createElement: handleCreateElement_,
        }}
      />
      <div className="editor-container" ref={containerRef} />
    </>
  );
}

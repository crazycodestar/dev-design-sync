interface DebuggerProps {
  tools: {
    createElement: () => void;
  };
}

export function Debugger({ tools }: DebuggerProps) {
  return (
    <div className="debugger">
      <button onClick={tools.createElement}>Create Element</button>
    </div>
  );
}

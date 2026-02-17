import { useState, useEffect } from "react";
import { getProofFooter, saveProofFooter, type ProofFooterState } from "@/lib/storage";

const ITEMS: { key: keyof ProofFooterState; label: string }[] = [
  { key: "uiBuilt", label: "UI Built" },
  { key: "logicWorking", label: "Logic Working" },
  { key: "testPassed", label: "Test Passed" },
  { key: "deployed", label: "Deployed" },
];

export default function ProofFooter() {
  const [state, setState] = useState<ProofFooterState>(getProofFooter);

  useEffect(() => {
    saveProofFooter(state);
  }, [state]);

  const toggle = (key: keyof ProofFooterState) => {
    setState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <footer className="sticky bottom-0 z-40 border-t border-border bg-card px-6 py-3 flex items-center justify-center gap-6 flex-wrap">
      {ITEMS.map(item => (
        <label key={item.key} className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={state[item.key]}
            onChange={() => toggle(item.key)}
            className="w-4 h-4 rounded border-border accent-primary"
          />
          <span className={state[item.key] ? "text-foreground font-medium" : "text-muted-foreground"}>
            {item.label}
          </span>
        </label>
      ))}
    </footer>
  );
}

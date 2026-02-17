import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTestChecklist, saveTestChecklist } from "@/lib/storage";

const TEST_ITEMS = [
  { label: "JD required validation works", hint: "Try submitting with empty JD field." },
  { label: "Short JD warning shows for <200 chars", hint: "Paste less than 200 characters and click Analyze." },
  { label: "Skills extraction groups correctly", hint: "Use a JD mentioning React, Python, SQL — check results." },
  { label: "Round mapping changes based on company + skills", hint: "Try 'Google' vs unknown startup name." },
  { label: "Score calculation is deterministic", hint: "Analyze the same JD twice — scores should match." },
  { label: "Skill toggles update score live", hint: "Toggle skills on results page and watch score change." },
  { label: "Changes persist after refresh", hint: "Toggle skills, refresh the page, reopen from history." },
  { label: "History saves and loads correctly", hint: "Analyze multiple JDs, check history page." },
  { label: "Export buttons copy the correct content", hint: "Click copy buttons and paste into a text editor." },
  { label: "No console errors on core pages", hint: "Open browser console, navigate all core pages." },
];

export default function TestChecklist() {
  const [checks, setChecks] = useState<boolean[]>(getTestChecklist);

  useEffect(() => {
    saveTestChecklist(checks);
  }, [checks]);

  const toggle = (i: number) => {
    setChecks(prev => prev.map((v, idx) => idx === i ? !v : v));
  };

  const reset = () => {
    setChecks(new Array(10).fill(false));
  };

  const passed = checks.filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="section-heading">Test Checklist</h1>
        <p className="section-subtext mt-1">Verify all features before shipping.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif flex items-center justify-between">
            <span>Tests Passed: {passed} / 10</span>
            <Button variant="ghost" size="sm" onClick={reset}>Reset checklist</Button>
          </CardTitle>
          {passed < 10 && (
            <p className="text-sm text-warning mt-1">Fix issues before shipping.</p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {TEST_ITEMS.map((item, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checks[i]}
                onChange={() => toggle(i)}
                className="mt-0.5 w-4 h-4 rounded border-border accent-primary shrink-0"
              />
              <div>
                <p className={`text-sm font-medium ${checks[i] ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  How to test: {item.hint}
                </p>
              </div>
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

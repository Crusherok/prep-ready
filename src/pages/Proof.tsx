import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSubmission, saveSubmission, getCompletedSteps, getTestChecklist } from "@/lib/storage";
import { toast } from "sonner";
import { Copy, Check, Circle } from "lucide-react";

const STEPS = [
  "Design System",
  "Landing Page",
  "Dashboard",
  "Analysis Engine",
  "Interactive Results",
  "Company Intel",
  "Test Checklist",
  "Ship",
];

function isValidUrl(s: string): boolean {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

export default function Proof() {
  const [submission, setSubmission] = useState(getSubmission);
  const completedSteps = getCompletedSteps();
  const checklistPassed = getTestChecklist().every(Boolean);

  useEffect(() => {
    saveSubmission(submission);
  }, [submission]);

  const update = (key: keyof typeof submission, value: string) => {
    setSubmission(prev => ({ ...prev, [key]: value }));
  };

  const allLinksValid = isValidUrl(submission.lovableLink) && isValidUrl(submission.githubLink) && isValidUrl(submission.deployedLink);

  const copyFinalSubmission = () => {
    if (!allLinksValid) {
      toast.error("Please provide valid URLs for all three links.");
      return;
    }
    const text = `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${submission.lovableLink}
GitHub Repository: ${submission.githubLink}
Live Deployment: ${submission.deployedLink}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`;

    navigator.clipboard.writeText(text);
    toast.success("Final submission copied to clipboard.");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="section-heading">Proof & Submission</h1>
        <p className="section-subtext mt-1">Document your build and submit your proof of work.</p>
      </div>

      {/* Step Completion */}
      <Card>
        <CardHeader><CardTitle className="font-serif">Step Completion Overview</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {STEPS.map((step, i) => {
            const completed = i < completedSteps;
            return (
              <div key={step} className="flex items-center gap-3">
                {completed ? (
                  <Check size={16} className="text-success shrink-0" />
                ) : (
                  <Circle size={16} className="text-muted-foreground shrink-0" />
                )}
                <span className={`text-sm ${completed ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  Step {i + 1}: {step}
                </span>
                <span className={`text-xs ml-auto ${completed ? "text-success" : "text-muted-foreground"}`}>
                  {completed ? "Completed" : "Pending"}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Artifact Inputs */}
      <Card>
        <CardHeader><CardTitle className="font-serif">Artifact Links</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {([
            { key: "lovableLink" as const, label: "Lovable Project Link" },
            { key: "githubLink" as const, label: "GitHub Repository Link" },
            { key: "deployedLink" as const, label: "Deployed URL" },
          ]).map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{label} <span className="text-primary">*</span></label>
              <input
                type="url"
                value={submission[key]}
                onChange={e => update(key, e.target.value)}
                placeholder="https://..."
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
              />
              {submission[key] && !isValidUrl(submission[key]) && (
                <p className="text-xs text-destructive">Please enter a valid URL.</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit */}
      <Card>
        <CardContent className="py-6 flex flex-col items-center gap-4">
          <Button onClick={copyFinalSubmission} disabled={!allLinksValid} size="lg">
            <Copy size={16} /> Copy Final Submission
          </Button>
          {!checklistPassed && (
            <p className="text-sm text-warning">Complete the test checklist to achieve Shipped status.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

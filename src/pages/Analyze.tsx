import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { runAnalysis } from "@/lib/analysis";
import { saveToHistory, setCurrentAnalysisId } from "@/lib/storage";
import { toast } from "sonner";

export default function Analyze() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [warning, setWarning] = useState("");

  const handleAnalyze = () => {
    if (!jdText.trim()) {
      toast.error("Job description is required.");
      return;
    }
    if (jdText.trim().length < 200) {
      setWarning("This JD is too short to analyze deeply. Paste full JD for better output.");
    } else {
      setWarning("");
    }

    const entry = runAnalysis(company.trim(), role.trim(), jdText.trim());
    saveToHistory(entry);
    setCurrentAnalysisId(entry.id);
    toast.success("Analysis complete.");
    navigate("/results");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="section-heading">Analyze Job Description</h1>
        <p className="section-subtext mt-1">Paste a JD to extract skills, generate a prep plan, and estimate readiness.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-serif">Job Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Company (optional)</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g., Google"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Role (optional)</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g., Software Engineer"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Job Description <span className="text-primary">*</span>
            </label>
            <textarea
              value={jdText}
              onChange={e => { setJdText(e.target.value); setWarning(""); }}
              placeholder="Paste the full job description here..."
              rows={10}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150 resize-y"
            />
            {warning && (
              <p className="text-sm text-warning">{warning}</p>
            )}
          </div>

          <Button onClick={handleAnalyze} size="lg">
            Analyze
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

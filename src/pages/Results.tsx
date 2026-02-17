import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReadinessCircle from "@/components/ReadinessCircle";
import CompanyIntel from "@/components/CompanyIntel";
import RoundTimeline from "@/components/RoundTimeline";
import { getCurrentAnalysisId, getEntryById, saveToHistory } from "@/lib/storage";
import { calculateFinalScore, getAllSkillNames } from "@/lib/analysis";
import type { AnalysisEntry, ExtractedSkills } from "@/lib/types";
import { toast } from "sonner";
import { Copy, Download, ArrowRight } from "lucide-react";

const CATEGORY_LABELS: Record<keyof Omit<ExtractedSkills, "other">, string> = {
  coreCS: "Core CS",
  languages: "Languages",
  web: "Web",
  data: "Data",
  cloud: "Cloud / DevOps",
  testing: "Testing",
};

export default function Results() {
  const navigate = useNavigate();
  const [entry, setEntry] = useState<AnalysisEntry | null>(null);

  useEffect(() => {
    const id = getCurrentAnalysisId();
    if (!id) { navigate("/analyze"); return; }
    const loaded = getEntryById(id);
    if (!loaded) { navigate("/analyze"); return; }
    setEntry(loaded);
  }, [navigate]);

  const updateEntry = useCallback((updated: AnalysisEntry) => {
    setEntry(updated);
    saveToHistory(updated);
  }, []);

  const toggleSkill = (skill: string) => {
    if (!entry) return;
    const newMap = { ...entry.skillConfidenceMap };
    newMap[skill] = newMap[skill] === "know" ? "practice" : "know";
    const newScore = calculateFinalScore(entry.baseScore, newMap);
    updateEntry({ ...entry, skillConfidenceMap: newMap, finalScore: newScore, updatedAt: new Date().toISOString() });
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard.`);
  };

  const formatPlan = () => {
    if (!entry) return "";
    return entry.plan7Days.map(d => `${d.day}: ${d.focus}\n${d.tasks.map(t => `  - ${t}`).join("\n")}`).join("\n\n");
  };

  const formatChecklist = () => {
    if (!entry) return "";
    return entry.checklist.map(r => `${r.roundTitle}\n${r.items.map(i => `  □ ${i}`).join("\n")}`).join("\n\n");
  };

  const formatQuestions = () => {
    if (!entry) return "";
    return entry.questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
  };

  const downloadTxt = () => {
    if (!entry) return;
    const content = [
      `Placement Readiness Analysis — ${entry.company || "N/A"}`,
      `Role: ${entry.role || "N/A"}`,
      `Score: ${entry.finalScore}/100`,
      `Date: ${new Date(entry.createdAt).toLocaleDateString()}`,
      "",
      "=== 7-Day Plan ===",
      formatPlan(),
      "",
      "=== Round Checklist ===",
      formatChecklist(),
      "",
      "=== Interview Questions ===",
      formatQuestions(),
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analysis-${entry.company || "report"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!entry) return null;

  const allSkills = getAllSkillNames(entry.extractedSkills);
  const weakSkills = allSkills.filter(s => entry.skillConfidenceMap[s] === "practice").slice(0, 3);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="section-heading">Analysis Results</h1>
        <p className="section-subtext mt-1">
          {entry.company && <span className="font-medium text-foreground">{entry.company}</span>}
          {entry.role && <span> — {entry.role}</span>}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Primary workspace */}
        <div className="workspace-primary space-y-6">
          {/* Readiness */}
          <Card>
            <CardHeader><CardTitle className="font-serif">Readiness Score</CardTitle></CardHeader>
            <CardContent className="flex justify-center">
              <div className="relative">
                <ReadinessCircle score={entry.finalScore} />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader><CardTitle className="font-serif">Key Skills Extracted</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {(Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]).map(cat => {
                const skills = entry.extractedSkills[cat];
                if (skills.length === 0) return null;
                return (
                  <div key={cat}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{CATEGORY_LABELS[cat]}</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => {
                        const isKnow = entry.skillConfidenceMap[skill] === "know";
                        return (
                          <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1 rounded-md text-sm font-medium border transition-all duration-150 ${
                              isKnow
                                ? "bg-success/15 text-success border-success/30"
                                : "bg-secondary text-secondary-foreground border-border"
                            }`}
                          >
                            {skill}
                            <span className="ml-1.5 text-xs opacity-70">{isKnow ? "✓ Know" : "Practice"}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {entry.extractedSkills.other.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">General</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.extractedSkills.other.map(skill => {
                      const isKnow = entry.skillConfidenceMap[skill] === "know";
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1 rounded-md text-sm font-medium border transition-all duration-150 ${
                            isKnow
                              ? "bg-success/15 text-success border-success/30"
                              : "bg-secondary text-secondary-foreground border-border"
                          }`}
                        >
                          {skill}
                          <span className="ml-1.5 text-xs opacity-70">{isKnow ? "✓ Know" : "Practice"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Intel */}
          {entry.companyInfo && <CompanyIntel info={entry.companyInfo} />}

          {/* Round Mapping */}
          <Card>
            <CardHeader><CardTitle className="font-serif">Round Mapping</CardTitle></CardHeader>
            <CardContent>
              <RoundTimeline rounds={entry.roundMapping} />
            </CardContent>
          </Card>

          {/* 7-Day Plan */}
          <Card>
            <CardHeader><CardTitle className="font-serif">7-Day Preparation Plan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {entry.plan7Days.map(day => (
                <div key={day.day} className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{day.day}: {day.focus}</p>
                  <ul className="space-y-0.5">
                    {day.tasks.map((task, i) => (
                      <li key={i} className="text-sm text-muted-foreground pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-border">
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card>
            <CardHeader><CardTitle className="font-serif">Round-wise Checklist</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {entry.checklist.map(round => (
                <div key={round.roundTitle} className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{round.roundTitle}</p>
                  <ul className="space-y-0.5">
                    {round.items.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground pl-4">□ {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader><CardTitle className="font-serif">Likely Interview Questions</CardTitle></CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {entry.questions.map((q, i) => (
                  <li key={i} className="text-sm text-foreground">
                    <span className="text-muted-foreground mr-2">{i + 1}.</span>{q}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Panel */}
        <div className="panel-secondary space-y-4">
          <Card>
            <CardHeader><CardTitle className="font-serif text-base">Export Tools</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="accent-outline" size="sm" className="w-full justify-start" onClick={() => copyText(formatPlan(), "7-day plan")}>
                <Copy size={14} /> Copy 7-day plan
              </Button>
              <Button variant="accent-outline" size="sm" className="w-full justify-start" onClick={() => copyText(formatChecklist(), "Round checklist")}>
                <Copy size={14} /> Copy round checklist
              </Button>
              <Button variant="accent-outline" size="sm" className="w-full justify-start" onClick={() => copyText(formatQuestions(), "Questions")}>
                <Copy size={14} /> Copy 10 questions
              </Button>
              <Button variant="accent-outline" size="sm" className="w-full justify-start" onClick={downloadTxt}>
                <Download size={14} /> Download as TXT
              </Button>
            </CardContent>
          </Card>

          {/* Action Next */}
          {weakSkills.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="font-serif text-base">Action Next</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Top weak areas:</p>
                <div className="space-y-1">
                  {weakSkills.map(s => (
                    <p key={s} className="text-sm font-medium text-foreground flex items-center gap-2">
                      <ArrowRight size={12} className="text-primary" /> {s}
                    </p>
                  ))}
                </div>
                <p className="text-sm text-foreground font-medium pt-2">Start Day 1 plan now.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

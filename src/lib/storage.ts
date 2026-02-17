import type { AnalysisEntry } from "./types";

const HISTORY_KEY = "prp_history";
const CURRENT_KEY = "prp_current_analysis_id";
const CHECKLIST_KEY = "prp_test_checklist";
const PROOF_FOOTER_KEY = "prp_proof_footer";
const SUBMISSION_KEY = "prp_final_submission";

// History
export function getHistory(): AnalysisEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((e: any) => e && typeof e.id === "string" && typeof e.jdText === "string");
  } catch {
    return [];
  }
}

export function saveToHistory(entry: AnalysisEntry): void {
  const history = getHistory();
  const idx = history.findIndex(h => h.id === entry.id);
  if (idx >= 0) {
    history[idx] = entry;
  } else {
    history.unshift(entry);
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getEntryById(id: string): AnalysisEntry | null {
  return getHistory().find(h => h.id === id) ?? null;
}

export function setCurrentAnalysisId(id: string): void {
  localStorage.setItem(CURRENT_KEY, id);
}

export function getCurrentAnalysisId(): string | null {
  return localStorage.getItem(CURRENT_KEY);
}

// Test checklist
export function getTestChecklist(): boolean[] {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (!raw) return new Array(10).fill(false);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 10) return new Array(10).fill(false);
    return parsed;
  } catch {
    return new Array(10).fill(false);
  }
}

export function saveTestChecklist(checklist: boolean[]): void {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist));
}

// Proof footer
export interface ProofFooterState {
  uiBuilt: boolean;
  logicWorking: boolean;
  testPassed: boolean;
  deployed: boolean;
}

export function getProofFooter(): ProofFooterState {
  try {
    const raw = localStorage.getItem(PROOF_FOOTER_KEY);
    if (!raw) return { uiBuilt: false, logicWorking: false, testPassed: false, deployed: false };
    return JSON.parse(raw);
  } catch {
    return { uiBuilt: false, logicWorking: false, testPassed: false, deployed: false };
  }
}

export function saveProofFooter(state: ProofFooterState): void {
  localStorage.setItem(PROOF_FOOTER_KEY, JSON.stringify(state));
}

// Final submission
export interface FinalSubmission {
  lovableLink: string;
  githubLink: string;
  deployedLink: string;
}

export function getSubmission(): FinalSubmission {
  try {
    const raw = localStorage.getItem(SUBMISSION_KEY);
    if (!raw) return { lovableLink: "", githubLink: "", deployedLink: "" };
    return JSON.parse(raw);
  } catch {
    return { lovableLink: "", githubLink: "", deployedLink: "" };
  }
}

export function saveSubmission(sub: FinalSubmission): void {
  localStorage.setItem(SUBMISSION_KEY, JSON.stringify(sub));
}

// Status derivation
export function getProjectStatus(): "Not Started" | "In Progress" | "Shipped" {
  const history = getHistory();
  if (history.length === 0) return "Not Started";

  const checklist = getTestChecklist();
  const allChecked = checklist.every(Boolean);
  const sub = getSubmission();
  const allLinks = sub.lovableLink && sub.githubLink && sub.deployedLink;
  const footer = getProofFooter();
  const allFooter = footer.uiBuilt && footer.logicWorking && footer.testPassed && footer.deployed;

  if (allChecked && allLinks && allFooter) return "Shipped";
  return "In Progress";
}

export function getCompletedSteps(): number {
  let steps = 3; // UI always built
  const history = getHistory();
  if (history.length > 0) steps++;
  if (history.some(e => Object.values(e.skillConfidenceMap || {}).some(v => v === "know"))) steps++;
  if (history.some(e => e.company?.trim())) steps++;
  const checklist = getTestChecklist();
  if (checklist.every(Boolean)) steps++;
  if (getProjectStatus() === "Shipped") steps++;
  return steps;
}

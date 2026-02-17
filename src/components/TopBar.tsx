import { getCompletedSteps, getProjectStatus } from "@/lib/storage";

export default function TopBar() {
  const steps = getCompletedSteps();
  const status = getProjectStatus();

  const statusColors: Record<string, string> = {
    "Not Started": "bg-muted text-muted-foreground",
    "In Progress": "bg-warning/15 text-warning",
    "Shipped": "bg-success/15 text-success",
  };

  return (
    <header className="sticky top-0 z-50 h-12 border-b border-border bg-card flex items-center justify-between px-6">
      <span className="font-serif font-semibold text-foreground">KodNest</span>
      <span className="text-sm text-muted-foreground font-medium">Step {steps} / 8</span>
      <span className={`text-xs font-medium px-3 py-1 rounded-md ${statusColors[status]}`}>
        {status}
      </span>
    </header>
  );
}

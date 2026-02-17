import type { RoundMapping } from "@/lib/types";

export default function RoundTimeline({ rounds }: { rounds: RoundMapping[] }) {
  return (
    <div className="space-y-0">
      {rounds.map((round, i) => (
        <div key={i} className="flex gap-4">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary mt-1.5 shrink-0" />
            {i < rounds.length - 1 && <div className="w-px flex-1 bg-border" />}
          </div>

          {/* Content */}
          <div className="pb-6">
            <h4 className="font-medium text-foreground text-sm">{round.roundTitle}</h4>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {round.focusAreas.map((area, j) => (
                <span key={j} className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                  {area}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{round.whyItMatters}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

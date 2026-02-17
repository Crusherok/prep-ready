import type { CompanyInfo } from "@/lib/types";

export default function CompanyIntel({ info }: { info: CompanyInfo }) {
  return (
    <div className="card-clean space-y-4">
      <h3 className="font-serif text-xl font-semibold text-foreground">Company Intel</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Company</p>
          <p className="font-medium text-foreground">{info.name}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Industry</p>
          <p className="font-medium text-foreground">{info.industry}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Estimated Size</p>
          <p className="font-medium text-foreground">{info.sizeCategory}</p>
        </div>
      </div>
      <div>
        <p className="text-muted-foreground text-sm mb-1">Typical Hiring Focus</p>
        <p className="text-sm text-foreground leading-relaxed">{info.hiringFocus}</p>
      </div>
      <p className="text-xs text-muted-foreground italic">Demo Mode: Company intel generated heuristically.</p>
    </div>
  );
}

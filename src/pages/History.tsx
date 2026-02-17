import { Link } from "react-router-dom";
import { getHistory, setCurrentAnalysisId } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function History() {
  const history = getHistory();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="section-heading">Analysis History</h1>
        <p className="section-subtext mt-1">View your past analyses.</p>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No analyses yet.</p>
            <Link to="/analyze" className="text-primary text-sm font-medium hover:underline mt-2 inline-block">
              Analyze a JD →
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map(entry => (
            <Link
              key={entry.id}
              to="/results"
              onClick={() => setCurrentAnalysisId(entry.id)}
              className="card-clean flex items-center justify-between hover:border-primary/30 transition-all duration-150 block"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {entry.company || "No company"} {entry.role && `— ${entry.role}`}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={12} />
                  <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif font-bold text-foreground">{entry.finalScore}</span>
                <p className="text-xs text-muted-foreground">/ 100</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

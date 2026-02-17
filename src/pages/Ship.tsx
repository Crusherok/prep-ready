import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { getTestChecklist, getProjectStatus } from "@/lib/storage";

export default function Ship() {
  const checklist = getTestChecklist();
  const allPassed = checklist.every(Boolean);
  const status = getProjectStatus();

  if (!allPassed) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="section-heading">Ship</h1>
          <p className="section-subtext mt-1">Complete all tests before shipping.</p>
        </div>
        <Card>
          <CardContent className="py-10 text-center space-y-4">
            <p className="text-muted-foreground">
              Test checklist incomplete — {checklist.filter(Boolean).length}/10 passed.
            </p>
            <Link to="/prp/07-test" className="text-primary text-sm font-medium hover:underline">
              Go to Test Checklist →
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="section-heading">Ship</h1>
        <p className="section-subtext mt-1">All tests passed. Ready to finalize.</p>
      </div>

      {status === "Shipped" ? (
        <Card>
          <CardContent className="py-10 text-center space-y-4">
            <div className="space-y-3">
              <p className="font-serif text-2xl font-semibold text-foreground">You built a real product.</p>
              <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                Not a tutorial. Not a clone.<br />
                A structured tool that solves a real problem.
              </p>
              <p className="text-sm font-medium text-primary pt-2">This is your proof of work.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-10 text-center space-y-4">
            <p className="text-muted-foreground">
              Tests passed. Complete your <Link to="/prp/proof" className="text-primary font-medium hover:underline">proof submission</Link> and mark all footer items to ship.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

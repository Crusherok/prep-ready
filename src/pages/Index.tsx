import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code, Video, BarChart3 } from "lucide-react";

const FEATURES = [
  {
    icon: Code,
    title: "Practice Problems",
    description: "Solve curated coding challenges across difficulty levels.",
  },
  {
    icon: Video,
    title: "Mock Interviews",
    description: "Simulate real interviews with structured feedback.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description: "Visualize your growth with data-driven insights.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Ace Your Placement
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Practice, assess, and prepare for your dream job.
          </p>
          <div className="pt-4">
            <Button asChild size="lg">
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(feature => (
            <div key={feature.title} className="card-clean flex flex-col items-start gap-4">
              <div className="p-2.5 rounded-md bg-primary/10">
                <feature.icon size={22} className="text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} KodNest. All rights reserved.</p>
      </footer>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReadinessCircle from "@/components/ReadinessCircle";
import SkillRadar from "@/components/SkillRadar";
import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";

const radarData = [
  { subject: "DSA", score: 75 },
  { subject: "System Design", score: 60 },
  { subject: "Communication", score: 80 },
  { subject: "Resume", score: 85 },
  { subject: "Aptitude", score: 70 },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ACTIVE_DAYS = [true, true, false, true, true, false, false];

const ASSESSMENTS = [
  { title: "DSA Mock Test", time: "Tomorrow, 10:00 AM" },
  { title: "System Design Review", time: "Wed, 2:00 PM" },
  { title: "HR Interview Prep", time: "Friday, 11:00 AM" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-heading">Dashboard</h1>
        <p className="section-subtext mt-1">Your placement preparation overview.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Readiness Score */}
        <Card>
          <CardHeader><CardTitle className="font-serif">Overall Readiness</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <div className="relative">
              <ReadinessCircle score={72} />
            </div>
          </CardContent>
        </Card>

        {/* Skill Breakdown */}
        <Card>
          <CardHeader><CardTitle className="font-serif">Skill Breakdown</CardTitle></CardHeader>
          <CardContent>
            <SkillRadar data={radarData} />
          </CardContent>
        </Card>

        {/* Continue Practice */}
        <Card>
          <CardHeader><CardTitle className="font-serif">Continue Practice</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Last topic:</p>
            <p className="font-medium text-foreground">Dynamic Programming</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">3 / 10</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-2 rounded-full bg-primary transition-all duration-300" style={{ width: "30%" }} />
              </div>
            </div>
            <Button asChild variant="accent-outline" size="sm">
              <Link to="/practice">Continue</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Weekly Goals */}
        <Card>
          <CardHeader><CardTitle className="font-serif">Weekly Goals</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Problems Solved</span>
                <span className="text-foreground font-medium">12 / 20 this week</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-2 rounded-full bg-primary transition-all duration-300" style={{ width: "60%" }} />
              </div>
            </div>
            <div className="flex gap-2">
              {DAYS.map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-150 ${
                      ACTIVE_DAYS[i] ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {day[0]}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assessments */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="font-serif">Upcoming Assessments</CardTitle></CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {ASSESSMENTS.map(a => (
                <div key={a.title} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">{a.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock size={14} />
                    <span>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

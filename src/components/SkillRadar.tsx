import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

interface SkillRadarProps {
  data: { subject: string; score: number }[];
}

export default function SkillRadar({ data }: SkillRadarProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

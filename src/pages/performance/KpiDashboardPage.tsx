import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDb } from "@/services/store";
import { BarChart3, TrendingUp, Filter, ListFilter, ArrowRight } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

export const KpiDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const db = useDb();

  const total = db.kpis.length;
  const onTrack = db.kpis.filter((k) => k.status === "on-track").length;
  const atRisk = db.kpis.filter((k) => k.status === "at-risk").length;
  const offTrack = db.kpis.filter((k) => k.status === "off-track").length;
  const notReported = db.kpis.filter((k) => k.status === "not-reported").length;

  const leadingCount = db.kpis.filter((k) => k.type === "leading").length;
  const laggingCount = db.kpis.filter((k) => k.type === "lagging").length;

  // Monthly trend mock data
  const trendData = [
    { period: "Jan", target: 80, actual: 74 },
    { period: "Feb", target: 80, actual: 76 },
    { period: "Mar", target: 85, actual: 79 },
    { period: "Apr", target: 85, actual: 82 },
    { period: "May", target: 85, actual: 81 },
    { period: "Jun", target: 90, actual: 86 },
    { period: "Jul", target: 90, actual: 88 },
    { period: "Aug", target: 90, actual: 87 },
  ];

  // Performance by Department Chart
  const deptData = Array.from(new Set(db.kpis.map((k) => k.department))).map((dept) => {
    const deptKpis = db.kpis.filter((k) => k.department === dept);
    const avgAchievement =
      deptKpis.reduce((s, k) => s + (k.target ? (k.actual / k.target) * 100 : 0), 0) /
      (deptKpis.length || 1);
    return {
      department: dept.replace(" Programmes", "").replace(" & Budget", ""),
      achievement: Math.round(avgAchievement),
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="KPI Performance Dashboard"
        subtitle="Real-time monitoring, leading vs lagging indicators, and performance trends."
        breadcrumbs={[{ label: "Performance", href: "/performance" }, { label: "Dashboard" }]}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate("/performance/scorecards")} className="h-9 text-xs">
              Executive Scorecard
            </Button>
            <Button size="sm" onClick={() => navigate("/performance/kpis")} className="h-9 text-xs">
              <ListFilter className="w-3.5 h-3.5 mr-1.5" /> KPI Repository
            </Button>
          </div>
        }
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard title="Total KPIs" value={total} subtitle="Across 12 Objectives" icon={<BarChart3 className="w-4 h-4 text-primary" />} />
        <KpiCard title="Achieved / On Track" value={onTrack} change={+5} status="on-track" icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} />
        <KpiCard title="At Risk" value={atRisk} status="at-risk" icon={<TrendingUp className="w-4 h-4 text-amber-500" />} />
        <KpiCard title="Off Track" value={offTrack} status="off-track" icon={<TrendingUp className="w-4 h-4 text-rose-500" />} />
        <KpiCard title="Not Reported" value={notReported} status="not-reported" icon={<TrendingUp className="w-4 h-4 text-gray-500" />} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Enterprise KPI Achievement Trend</CardTitle>
            <CardDescription className="text-xs">Monthly target vs actual performance trajectory</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="target" stroke="#94a3b8" fill="#cbd5e1" fillOpacity={0.3} name="Target %" />
                <Area type="monotone" dataKey="actual" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.4} name="Actual %" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leading vs Lagging breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Indicator Type Mix</CardTitle>
            <CardDescription className="text-xs">Leading vs Lagging KPI ratio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">Leading Indicators ({leadingCount})</span>
                <span className="text-muted-foreground">{Math.round((leadingCount / total) * 100)}%</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${(leadingCount / total) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">Lagging Indicators ({laggingCount})</span>
                <span className="text-muted-foreground">{Math.round((laggingCount / total) * 100)}%</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full" style={{ width: `${(laggingCount / total) * 100}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground space-y-1">
              <span className="font-bold text-foreground block">Governance Recommendation</span>
              Maintain at least 30% leading indicators to provide early warnings before quarterly reviews.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Department */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">KPI Achievement by Owning Department</CardTitle>
          <CardDescription className="text-xs">Average achievement score across departments</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="department" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="achievement" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

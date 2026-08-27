import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDb } from "@/services/store";
import {
  Target,
  BarChart3,
  Rocket,
  Briefcase,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Clock,
  Activity,
  Calendar,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const db = useDb();

  // Metric Computations
  const totalKpis = db.kpis.length;
  const onTrackKpis = db.kpis.filter((k) => k.status === "on-track").length;
  const atRiskKpis = db.kpis.filter((k) => k.status === "at-risk").length;
  const offTrackKpis = db.kpis.filter((k) => k.status === "off-track").length;
  const notReportedKpis = db.kpis.filter((k) => k.status === "not-reported").length;

  const totalProjects = db.projects.length;
  const atRiskProjects = db.projects.filter((p) => p.health === "red" || p.health === "amber").length;

  const openRisks = db.risks.filter((r) => r.status === "open" || r.status === "escalated").length;
  const criticalRisks = db.risks.filter((r) => r.probability * r.impact >= 16).length;

  const totalBudget = db.portfolios.reduce((s, p) => s + p.budget, 0);
  const totalActualSpend = db.portfolios.reduce((s, p) => s + p.actualCost, 0);
  const budgetUtilization = Math.round((totalActualSpend / totalBudget) * 100);

  // Strategy Pillars Chart Data
  const pillarChartData = db.pillars.map((p) => ({
    name: p.code,
    fullName: p.name,
    performance: p.performance,
    weight: p.weight,
  }));

  // KPI Donut Chart Data
  const kpiDonutData = [
    { name: "On Track", value: onTrackKpis, color: "#10b981" },
    { name: "At Risk", value: atRiskKpis, color: "#f59e0b" },
    { name: "Off Track", value: offTrackKpis, color: "#ef4444" },
    { name: "Not Reported", value: notReportedKpis, color: "#6b7280" },
  ];

  // Upcoming Milestones
  const upcomingMilestones = db.projects
    .flatMap((p) => p.milestones.map((m) => ({ ...m, projectName: p.name })))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        subtitle="National strategy governance, enterprise performance metrics, and project portfolio oversight."
        actions={
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate("/reports")} variant="outline" className="h-9 text-xs">
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Reports & Analytics
            </Button>
            <Button size="sm" onClick={() => navigate("/strategy/map")} className="h-9 text-xs">
              <Target className="w-3.5 h-3.5 mr-1.5" /> Strategy Map
            </Button>
          </div>
        }
      />

      {/* 8 Metric KPI Cards (Section 6 Requirements) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Overall Strategy Performance"
          value="78.2%"
          change={+3.1}
          status="on-track"
          icon={<Target className="w-5 h-5 text-primary" />}
          onClick={() => navigate("/strategy")}
        />
        <KpiCard
          title="KPI Achievement Rate"
          value={`${Math.round((onTrackKpis / totalKpis) * 100)}%`}
          subtitle={`${onTrackKpis} of ${totalKpis} KPIs achieved`}
          status={onTrackKpis >= totalKpis * 0.6 ? "on-track" : "at-risk"}
          icon={<BarChart3 className="w-5 h-5 text-emerald-500" />}
          onClick={() => navigate("/performance")}
        />
        <KpiCard
          title="Active Strategic Initiatives"
          value={db.initiatives.length}
          subtitle="All chartered FY2026 initiatives"
          progress={72}
          icon={<Rocket className="w-5 h-5 text-blue-500" />}
          onClick={() => navigate("/strategy/initiatives")}
        />
        <KpiCard
          title="Active Projects"
          value={totalProjects}
          change={+2}
          changeLabel="vs last month"
          icon={<Briefcase className="w-5 h-5 text-purple-500" />}
          onClick={() => navigate("/projects")}
        />
        <KpiCard
          title="Projects At Risk"
          value={atRiskProjects}
          subtitle={`${atRiskProjects} project(s) require intervention`}
          status={atRiskProjects > 0 ? "at-risk" : "on-track"}
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          onClick={() => navigate("/projects")}
        />
        <KpiCard
          title="Open Risks"
          value={openRisks}
          subtitle={`${criticalRisks} critical score risk(s)`}
          status={criticalRisks > 0 ? "off-track" : "on-track"}
          icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
          onClick={() => navigate("/risks")}
        />
        <KpiCard
          title="Budget Utilization"
          value={`${budgetUtilization}%`}
          subtitle={`$${(totalActualSpend / 1_000_000).toFixed(0)}M of $${(totalBudget / 1_000_000).toFixed(0)}M allocated`}
          progress={budgetUtilization}
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          onClick={() => navigate("/financials")}
        />
        <KpiCard
          title="Portfolio Health"
          value="Good"
          subtitle="4 of 5 portfolios green health"
          status="on-track"
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
          onClick={() => navigate("/portfolios")}
        />
      </div>

      {/* Main Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Performance by Pillar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Strategy Performance by Pillar</CardTitle>
              <CardDescription className="text-xs">Weighted FY2026 performance against national targets</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/strategy")} className="text-xs h-8">
              Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pillarChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-popover border border-border p-2.5 rounded-md shadow-md text-xs space-y-1">
                          <p className="font-bold text-foreground">{data.fullName}</p>
                          <p className="text-muted-foreground">Performance: <span className="font-semibold text-foreground">{data.performance}%</span></p>
                          <p className="text-muted-foreground">Weight: <span className="font-semibold text-foreground">{data.weight}%</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="performance" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* KPI Performance Breakdown Donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">KPI Achievement Breakdown</CardTitle>
            <CardDescription className="text-xs">Distribution of {totalKpis} active KPIs</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kpiDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {kpiDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full pt-2 border-t border-border text-xs">
              {kpiDonutData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-semibold text-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Initiatives & Upcoming Milestones Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Strategic Initiatives Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold">Strategic Initiatives Progress</CardTitle>
              <CardDescription className="text-xs">Active high-priority execution programmes</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/strategy/initiatives")} className="text-xs h-8">
              View All Initiatives
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-y border-border">
                  <tr>
                    <th className="p-3">Initiative</th>
                    <th className="p-3">Owner</th>
                    <th className="p-3">Progress</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {db.initiatives.slice(0, 5).map((ini) => (
                    <tr
                      key={ini.id}
                      onClick={() => navigate(`/strategy/initiatives/${ini.id}`)}
                      className="hover:bg-muted/40 cursor-pointer transition-colors"
                    >
                      <td className="p-3 font-semibold text-foreground max-w-[200px] truncate">
                        {ini.name}
                      </td>
                      <td className="p-3 text-muted-foreground">{ini.owner}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-secondary h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${ini.progress}%` }} />
                          </div>
                          <span className="font-medium">{ini.progress}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <StatusBadge status={ini.status} />
                      </td>
                      <td className="p-3 text-right text-muted-foreground">{ini.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Milestones */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Upcoming Milestones
            </CardTitle>
            <CardDescription className="text-xs">Near-term project delivery gates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingMilestones.map((m) => (
              <div key={m.id} className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground truncate">{m.name}</span>
                  <StatusBadge status={m.status} className="text-[10px] px-1.5 py-0" />
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{m.projectName}</p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due: {m.date}
                  </span>
                  <span>{m.owner}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Recent Governance Activity
          </CardTitle>
          <CardDescription className="text-xs">Real-time system events, updates & approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative border-l border-border ml-3 pl-4 space-y-4 text-xs">
            {db.notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{n.title}</span>
                  <span className="text-[10px] text-muted-foreground">{n.createdAt.slice(0, 10)}</span>
                </div>
                <p className="text-muted-foreground mt-0.5">{n.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

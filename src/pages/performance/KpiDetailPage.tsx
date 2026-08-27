import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDb, kpiService } from "@/services/store";
import { ArrowLeft, BarChart2, TrendingUp, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export const KpiDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const db = useDb();

  const kpi = db.kpis.find((k) => k.id === id);

  if (!kpi) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-lg font-bold text-foreground">KPI Not Found</h2>
        <Button onClick={() => navigate("/performance/kpis")} size="sm">
          Back to Repository
        </Button>
      </div>
    );
  }

  const obj = db.objectives.find((o) => o.id === kpi.objectiveId);
  const achievement = kpiService.achievement(kpi);
  const actions = db.correctiveActions.filter((c) => c.kpiId === kpi.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${kpi.code}: ${kpi.name}`}
        subtitle={`Owning Department: ${kpi.department} | Frequency: ${kpi.frequency}`}
        breadcrumbs={[
          { label: "Performance", href: "/performance" },
          { label: "KPI Repository", href: "/performance/kpis" },
          { label: kpi.code },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/performance/kpis")} className="h-9 gap-1.5 text-xs">
            <ArrowLeft className="w-4 h-4" /> Back to Repository
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Target</p>
          <p className="text-2xl font-bold text-foreground mt-1">{kpi.target} {kpi.unit}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Actual</p>
          <p className="text-2xl font-bold text-foreground mt-1">{kpi.actual} {kpi.unit}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Achievement Rate</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-foreground">{achievement}%</span>
            <StatusBadge status={kpi.status} />
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Data Source</p>
          <p className="text-sm font-bold text-foreground mt-2">{kpi.dataSource}</p>
        </Card>
      </div>

      {/* Target vs Actual Trend Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Historical Target vs Actual Trend</CardTitle>
          <CardDescription className="text-xs">Period performance tracking</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={kpi.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="target" stroke="#94a3b8" fill="#cbd5e1" fillOpacity={0.3} name="Target" />
              <Area type="monotone" dataKey="actual" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.4} name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* KPI Definition & Formula */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">KPI Metadata & Definition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-muted-foreground leading-relaxed">{kpi.definition}</p>
            <div className="space-y-2 pt-3 border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Indicator Type</span>
                <span className="font-semibold uppercase text-primary">{kpi.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Strategic Objective</span>
                <span className="font-semibold text-foreground">{obj?.name ?? kpi.objectiveId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Polarity</span>
                <span className="font-semibold">{kpi.polarity === "increase" ? "Higher is better" : "Lower is better"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Calculation Formula & Action Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-3 rounded-md bg-muted font-mono text-xs">
              {kpi.formula}
            </div>

            <div className="space-y-2 pt-2">
              <span className="font-bold text-foreground block">Corrective Action Plans ({actions.length})</span>
              {actions.length > 0 ? (
                actions.map((act) => (
                  <div key={act.id} className="p-2.5 rounded-md border border-border bg-card space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>{act.code}</span>
                      <StatusBadge status={act.status} className="text-[10px]" />
                    </div>
                    <p className="text-muted-foreground">{act.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No corrective action plans currently required for this KPI.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDb, kpiService } from "@/services/store";

export const KpiScorecardPage: React.FC = () => {
  const db = useDb();
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("FY2026 Q3");

  const departments = Array.from(new Set(db.kpis.map((k) => k.department)));

  const filteredKpis = db.kpis.filter((k) =>
    selectedDept === "all" ? true : k.department === selectedDept
  );

  const weightedScore = Math.round(
    filteredKpis.reduce((acc, k) => acc + kpiService.achievement(k) * (k.weight || 5), 0) /
      (filteredKpis.reduce((acc, k) => acc + (k.weight || 5), 0) || 1)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Performance Scorecard"
        subtitle="Weighted achievement scores across departments and strategic pillars."
        breadcrumbs={[{ label: "Performance", href: "/performance" }, { label: "Executive Scorecard" }]}
        actions={
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="h-9 text-xs w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FY2026 Q1">FY2026 Q1</SelectItem>
                <SelectItem value="FY2026 Q2">FY2026 Q2</SelectItem>
                <SelectItem value="FY2026 Q3">FY2026 Q3</SelectItem>
                <SelectItem value="FY2026 Full Year">FY2026 Full Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger className="h-9 text-xs w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ExportButton filename="performance_scorecard.csv" data={filteredKpis} />
          </div>
        }
      />

      {/* Weighted Score Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Composite Score Scorecard ({selectedPeriod})
            </span>
            <h2 className="text-3xl font-extrabold text-foreground mt-1">{weightedScore}%</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Weighted average calculated across {filteredKpis.length} active strategic KPIs
            </p>
          </div>
          <StatusBadge
            status={weightedScore >= 85 ? "on-track" : weightedScore >= 70 ? "at-risk" : "off-track"}
            className="text-sm py-1 px-4"
          />
        </CardContent>
      </Card>

      {/* Scorecard Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Performance Scorecard Ledger</CardTitle>
          <CardDescription className="text-xs">Detailed indicator scorecard metrics</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground font-semibold border-y border-border">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">KPI Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3 text-center">Baseline</th>
                  <th className="p-3 text-center">Target</th>
                  <th className="p-3 text-center">Actual</th>
                  <th className="p-3 text-center">Weight</th>
                  <th className="p-3 text-center">Achievement</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredKpis.map((k) => {
                  const ach = kpiService.achievement(k);
                  return (
                    <tr key={k.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary">{k.code}</td>
                      <td className="p-3 font-medium text-foreground">{k.name}</td>
                      <td className="p-3 text-muted-foreground">{k.department}</td>
                      <td className="p-3 text-center font-mono">{k.baseline} {k.unit}</td>
                      <td className="p-3 text-center font-mono">{k.target} {k.unit}</td>
                      <td className="p-3 text-center font-mono font-bold">{k.actual} {k.unit}</td>
                      <td className="p-3 text-center font-mono">{k.weight}%</td>
                      <td className="p-3 text-center font-mono font-bold">{ach}%</td>
                      <td className="p-3"><StatusBadge status={k.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

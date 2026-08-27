import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useDb } from "@/services/store";
import { Calendar, GanttChartSquare } from "lucide-react";

export const GanttPlanPage: React.FC = () => {
  const db = useDb();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(db.projects[0]?.id ?? "PRJ-001");

  const project = db.projects.find((p) => p.id === selectedProjectId) ?? db.projects[0];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Schedule & Interactive Gantt Plan"
        subtitle="Visual phase timelines, task dependencies, and schedule progress tracking."
        breadcrumbs={[{ label: "Projects & Portfolios", href: "/portfolios" }, { label: "Project Plan" }]}
        actions={
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="h-9 text-xs w-[240px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {db.projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {/* Project Summary Banner */}
      {project && (
        <Card className="bg-muted/30">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-primary">{project.code}</span>
                <h3 className="font-bold text-base text-foreground">{project.name}</h3>
              </div>
              <p className="text-muted-foreground mt-0.5">Manager: {project.manager} | Dates: {project.startDate} to {project.endDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={project.health} />
              <span className="font-bold text-sm font-mono">{project.progress}% Complete</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gantt Matrix Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <GanttChartSquare className="w-4 h-4 text-primary" /> FY2026 Timeline Gantt Chart
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[800px] border-t border-border">
            {/* Timeline Month Headers */}
            <div className="grid grid-cols-12 bg-muted/60 text-center text-xs font-semibold py-2 border-b border-border text-muted-foreground">
              {months.map((m) => (
                <div key={m}>{m}</div>
              ))}
            </div>

            {/* Phases Breakdown */}
            <div className="divide-y divide-border">
              {project?.phases.map((ph, idx) => {
                const startM = Number(ph.start.slice(5, 7));
                const endM = Number(ph.end.slice(5, 7));
                const colSpan = Math.max(1, endM - startM + 1);

                return (
                  <div key={ph.id} className="py-3 px-4 space-y-2 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground">Phase {idx + 1}: {ph.name}</span>
                      <span className="text-muted-foreground font-mono text-[11px]">{ph.start} to {ph.end} ({ph.progress}%)</span>
                    </div>

                    {/* Timeline Bar Container */}
                    <div className="grid grid-cols-12 gap-1 h-6 bg-muted/40 rounded-md relative p-0.5">
                      <div
                        className="h-full bg-primary/80 rounded flex items-center px-2 text-[10px] text-primary-foreground font-bold truncate shadow-2xs"
                        style={{
                          gridColumnStart: startM,
                          gridColumnEnd: `span ${colSpan}`,
                        }}
                      >
                        {ph.name} ({ph.progress}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDb } from "@/services/store";
import { Building2, Layers, Target, BarChart2 } from "lucide-react";

export const PerformanceCascadingPage: React.FC = () => {
  const db = useDb();
  const [selectedSector, setSelectedSector] = useState<string>(db.orgNodes.find((n) => n.level === "sector")?.id ?? "ORG-S1");

  const sectors = db.orgNodes.filter((n) => n.level === "sector");
  const currentSector = db.orgNodes.find((n) => n.id === selectedSector) ?? sectors[0];
  const departments = currentSector ? db.orgNodes.filter((n) => n.parentId === currentSector.id) : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Cascading Architecture"
        subtitle="Multi-tier alignment drill-down from Enterprise Centre → Sector → Department → Objectives → KPIs."
        breadcrumbs={[{ label: "Performance", href: "/performance" }, { label: "Cascading Alignment" }]}
      />

      {/* Sector Navigation Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {sectors.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSector(s.id)}
            className={`p-3 rounded-lg border text-left text-xs transition-all flex flex-col justify-between ${
              selectedSector === s.id
                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                : "bg-card text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            <div>
              <span className="font-bold block text-sm">{s.name}</span>
              <span className="text-[11px] opacity-80">{s.head}</span>
            </div>
            <div className="mt-2 font-mono font-bold text-xs">{s.performance}% Score</div>
          </button>
        ))}
      </div>

      {/* Cascading Tree */}
      {currentSector && (
        <div className="space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Sector Governance: {currentSector.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <p className="text-muted-foreground">Sector Lead: <span className="font-bold text-foreground">{currentSector.head}</span> | Total Headcount: <span className="font-bold text-foreground">{currentSector.headcount}</span></p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {departments.map((dept) => {
              const deptObjs = db.objectives.filter((o) => o.department.includes(dept.name.replace(" Programmes", "")) || dept.name.includes(o.department));
              return (
                <Card key={dept.id} className="border-border">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary" /> Department: {dept.name}
                      </CardTitle>
                      <span className="font-mono text-xs font-bold text-primary">{dept.performance}% Performance</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {deptObjs.length > 0 ? (
                      deptObjs.map((obj) => {
                        const kpis = db.kpis.filter((k) => k.objectiveId === obj.id);
                        return (
                          <div key={obj.id} className="p-3 rounded-md bg-muted/30 border border-border/60 space-y-2 text-xs">
                            <div className="flex items-center justify-between font-semibold">
                              <span className="flex items-center gap-1.5 text-foreground">
                                <Target className="w-3.5 h-3.5 text-primary" /> {obj.code}: {obj.name}
                              </span>
                              <StatusBadge status={obj.status} />
                            </div>
                            <div className="pl-5 border-l-2 border-primary/30 space-y-1">
                              {kpis.map((k) => (
                                <div key={k.id} className="flex items-center justify-between text-[11px] text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <BarChart2 className="w-3 h-3 text-muted-foreground" /> {k.code}: {k.name}
                                  </span>
                                  <span className="font-mono font-bold text-foreground">{k.actual} / {k.target} {k.unit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-muted-foreground">Direct department performance cascade mapped via central KPI registry.</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

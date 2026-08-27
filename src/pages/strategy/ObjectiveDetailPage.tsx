import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useDb } from "@/services/store";
import { Target, BarChart2, Rocket, Briefcase, AlertTriangle, History, ArrowLeft } from "lucide-react";

export const ObjectiveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const db = useDb();

  const obj = db.objectives.find((o) => o.id === id);

  if (!obj) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Strategic Objective Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested objective ID standard does not exist.</p>
        <Button onClick={() => navigate("/strategy/objectives")} size="sm">
          Back to Objectives
        </Button>
      </div>
    );
  }

  const pillar = db.pillars.find((p) => p.id === obj.pillarId);
  const linkedKpis = db.kpis.filter((k) => k.objectiveId === obj.id);
  const linkedInitiatives = db.initiatives.filter((i) => i.objectiveId === obj.id);
  const linkedProjects = db.projects.filter((p) =>
    linkedInitiatives.some((ini) => ini.id === p.initiativeId)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${obj.code}: ${obj.name}`}
        subtitle={`Owning Department: ${obj.department} | Strategic Pillar: ${pillar?.name ?? obj.pillarId}`}
        breadcrumbs={[
          { label: "Strategy Management", href: "/strategy" },
          { label: "Objectives", href: "/strategy/objectives" },
          { label: obj.code },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/strategy/objectives")} className="h-9 gap-1.5 text-xs">
            <ArrowLeft className="w-4 h-4" /> Back to Objectives
          </Button>
        }
      />

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Performance Score</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-foreground">{obj.performance}%</span>
            <StatusBadge status={obj.status} />
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Strategic Weight</p>
          <p className="text-2xl font-bold text-foreground mt-1">{obj.weight}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Accountable Owner</p>
          <p className="text-sm font-bold text-foreground mt-2">{obj.owner}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Linked KPIs</p>
          <p className="text-2xl font-bold text-foreground mt-1">{linkedKpis.length}</p>
        </Card>
      </div>

      {/* Detail Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="kpis" className="text-xs">Linked KPIs ({linkedKpis.length})</TabsTrigger>
          <TabsTrigger value="initiatives" className="text-xs">Initiatives ({linkedInitiatives.length})</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs">Projects ({linkedProjects.length})</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">Governance History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Objective Scope & Governance Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <p className="text-foreground leading-relaxed text-sm">{obj.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div>
                  <span className="text-muted-foreground block font-medium">Start Date</span>
                  <span className="font-semibold text-foreground">{obj.startDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">End Date</span>
                  <span className="font-semibold text-foreground">{obj.endDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Owning Sector</span>
                  <span className="font-semibold text-foreground">Digital & Tech Sector</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Governance Baseline</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Approved FY2026</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kpis">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">KPI Code</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Target</th>
                    <th className="p-3">Actual</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {linkedKpis.map((k) => (
                    <tr
                      key={k.id}
                      onClick={() => navigate(`/performance/kpis/${k.id}`)}
                      className="hover:bg-muted/40 cursor-pointer"
                    >
                      <td className="p-3 font-mono font-bold text-primary">{k.code}</td>
                      <td className="p-3 font-medium text-foreground">{k.name}</td>
                      <td className="p-3">{k.target} {k.unit}</td>
                      <td className="p-3 font-bold">{k.actual} {k.unit}</td>
                      <td className="p-3"><StatusBadge status={k.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="initiatives">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Initiative Name</th>
                    <th className="p-3">Progress</th>
                    <th className="p-3">Budget</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {linkedInitiatives.map((ini) => (
                    <tr
                      key={ini.id}
                      onClick={() => navigate(`/strategy/initiatives/${ini.id}`)}
                      className="hover:bg-muted/40 cursor-pointer"
                    >
                      <td className="p-3 font-mono font-bold text-primary">{ini.code}</td>
                      <td className="p-3 font-medium text-foreground">{ini.name}</td>
                      <td className="p-3 font-semibold">{ini.progress}%</td>
                      <td className="p-3">${(ini.budget / 1_000_000).toFixed(1)}M</td>
                      <td className="p-3"><StatusBadge status={ini.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Project Name</th>
                    <th className="p-3">Manager</th>
                    <th className="p-3">Progress</th>
                    <th className="p-3">Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {linkedProjects.map((prj) => (
                    <tr
                      key={prj.id}
                      onClick={() => navigate(`/projects/${prj.id}`)}
                      className="hover:bg-muted/40 cursor-pointer"
                    >
                      <td className="p-3 font-mono font-bold text-primary">{prj.code}</td>
                      <td className="p-3 font-medium text-foreground">{prj.name}</td>
                      <td className="p-3 text-muted-foreground">{prj.manager}</td>
                      <td className="p-3 font-semibold">{prj.progress}%</td>
                      <td className="p-3"><StatusBadge status={prj.health} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-4 space-y-3">
              {obj.history.map((h, i) => (
                <div key={i} className="flex items-start justify-between text-xs pb-2 border-b border-border/50 last:border-0">
                  <div>
                    <span className="font-semibold text-foreground block">{h.action}</span>
                    <span className="text-muted-foreground text-[11px]">Actor: {h.actor}</span>
                  </div>
                  <span className="text-muted-foreground font-mono">{h.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

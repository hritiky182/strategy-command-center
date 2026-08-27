import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useDb } from "@/services/store";
import { ArrowLeft, Rocket, DollarSign, Calendar, CheckCircle, AlertTriangle } from "lucide-react";

export const InitiativeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const db = useDb();

  const ini = db.initiatives.find((i) => i.id === id);

  if (!ini) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Initiative Not Found</h2>
        <Button onClick={() => navigate("/strategy/initiatives")} size="sm">
          Back to Initiatives
        </Button>
      </div>
    );
  }

  const obj = db.objectives.find((o) => o.id === ini.objectiveId);
  const linkedProjects = db.projects.filter((p) => p.initiativeId === ini.id);
  const linkedRisks = db.risks.filter((r) => r.entityId === ini.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${ini.code}: ${ini.name}`}
        subtitle={`Owning Objective: ${obj?.name ?? ini.objectiveId} | Accountable Lead: ${ini.owner}`}
        breadcrumbs={[
          { label: "Strategy Management", href: "/strategy" },
          { label: "Initiatives", href: "/strategy/initiatives" },
          { label: ini.code },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/strategy/initiatives")} className="h-9 gap-1.5 text-xs">
            <ArrowLeft className="w-4 h-4" /> Back to Initiatives
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Overall Progress</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-foreground">{ini.progress}%</span>
            <StatusBadge status={ini.status} />
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Approved Budget</p>
          <p className="text-2xl font-bold text-foreground mt-1">${(ini.budget / 1_000_000).toFixed(1)}M</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Actual Spend</p>
          <p className="text-2xl font-bold text-foreground mt-1">${(ini.actualCost / 1_000_000).toFixed(1)}M</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Linked Projects</p>
          <p className="text-2xl font-bold text-foreground mt-1">{linkedProjects.length}</p>
        </Card>
      </div>

      {/* Detail Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="activities" className="text-xs">Activities ({ini.activities.length})</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs">Linked Projects ({linkedProjects.length})</TabsTrigger>
          <TabsTrigger value="risks" className="text-xs">Risks ({linkedRisks.length})</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Initiative Charter & Scope</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <p className="text-foreground leading-relaxed text-sm">{ini.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div>
                  <span className="text-muted-foreground block font-medium">Start Date</span>
                  <span className="font-semibold text-foreground">{ini.startDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">End Date</span>
                  <span className="font-semibold text-foreground">{ini.endDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Department</span>
                  <span className="font-semibold text-foreground">{ini.department}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Budget Utilization</span>
                  <span className="font-semibold text-emerald-600">
                    {Math.round((ini.actualCost / ini.budget) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Activity</th>
                    <th className="p-3">Lead Owner</th>
                    <th className="p-3">Progress</th>
                    <th className="p-3 text-right">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ini.activities.map((act) => (
                    <tr key={act.id} className="hover:bg-muted/40">
                      <td className="p-3 font-medium text-foreground">{act.name}</td>
                      <td className="p-3 text-muted-foreground">{act.owner}</td>
                      <td className="p-3 font-bold">{act.progress}%</td>
                      <td className="p-3 text-right text-muted-foreground">{act.due}</td>
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
                  {linkedProjects.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => navigate(`/projects/${p.id}`)}
                      className="hover:bg-muted/40 cursor-pointer"
                    >
                      <td className="p-3 font-mono font-bold text-primary">{p.code}</td>
                      <td className="p-3 font-medium text-foreground">{p.name}</td>
                      <td className="p-3 text-muted-foreground">{p.manager}</td>
                      <td className="p-3 font-bold">{p.progress}%</td>
                      <td className="p-3"><StatusBadge status={p.health} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Risk ID</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {linkedRisks.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/40">
                      <td className="p-3 font-mono font-bold text-primary">{r.code}</td>
                      <td className="p-3 font-medium text-foreground">{r.title}</td>
                      <td className="p-3 text-muted-foreground">{r.category}</td>
                      <td className="p-3 font-bold">{r.probability * r.impact}</td>
                      <td className="p-3"><StatusBadge status={r.status} /></td>
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
              {ini.history.map((h, i) => (
                <div key={i} className="flex items-start justify-between text-xs pb-2 border-b border-border/50">
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

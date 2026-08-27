import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useDb } from "@/services/store";
import { ArrowLeft, Briefcase, Calendar, CheckCircle2, Clock, Users, FileText, AlertTriangle } from "lucide-react";

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const db = useDb();

  const prj = db.projects.find((p) => p.id === id);

  if (!prj) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Project Not Found</h2>
        <Button onClick={() => navigate("/projects")} size="sm">
          Back to Projects
        </Button>
      </div>
    );
  }

  const pf = db.portfolios.find((p) => p.id === prj.portfolioId);
  const ini = db.initiatives.find((i) => i.id === prj.initiativeId);
  const projectRisks = db.risks.filter((r) => r.entityId === prj.id);
  const projectIssues = db.issues.filter((i) => i.projectId === prj.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${prj.code}: ${prj.name}`}
        subtitle={`Portfolio: ${pf?.name ?? prj.portfolioId} | Department: ${prj.department} | Manager: ${prj.manager}`}
        breadcrumbs={[
          { label: "Projects & Portfolios", href: "/portfolios" },
          { label: "Projects", href: "/projects" },
          { label: prj.code },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/projects")} className="h-9 gap-1.5 text-xs">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Progress</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-foreground">{prj.progress}%</span>
            <StatusBadge status={prj.health} />
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Approved Budget</p>
          <p className="text-2xl font-bold text-foreground mt-1">${(prj.budget / 1_000_000).toFixed(1)}M</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Actual Cost</p>
          <p className="text-2xl font-bold text-foreground mt-1">${(prj.actualCost / 1_000_000).toFixed(1)}M</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Milestones</p>
          <p className="text-2xl font-bold text-foreground mt-1">{prj.milestones.length}</p>
        </Card>
      </div>

      {/* Detail Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted p-1 flex-wrap">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="phases" className="text-xs">Phases ({prj.phases.length})</TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs">Tasks ({prj.tasks.length})</TabsTrigger>
          <TabsTrigger value="milestones" className="text-xs">Milestones ({prj.milestones.length})</TabsTrigger>
          <TabsTrigger value="resources" className="text-xs">Resources ({prj.resources.length})</TabsTrigger>
          <TabsTrigger value="risks" className="text-xs">Risks & Issues ({projectRisks.length + projectIssues.length})</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">Documents ({prj.documents.length})</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Project Scope & Baseline Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <p className="text-foreground leading-relaxed text-sm">{prj.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div>
                  <span className="text-muted-foreground block font-medium">Start Date</span>
                  <span className="font-semibold text-foreground">{prj.startDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">End Date</span>
                  <span className="font-semibold text-foreground">{prj.endDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Parent Initiative</span>
                  <span className="font-semibold text-foreground">{ini?.name ?? prj.initiativeId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Type</span>
                  <span className="font-semibold uppercase text-primary">{prj.type}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Phase</th>
                    <th className="p-3">Start Date</th>
                    <th className="p-3">End Date</th>
                    <th className="p-3">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {prj.phases.map((ph) => (
                    <tr key={ph.id} className="hover:bg-muted/40">
                      <td className="p-3 font-semibold text-foreground">{ph.name}</td>
                      <td className="p-3">{ph.start}</td>
                      <td className="p-3">{ph.end}</td>
                      <td className="p-3 font-bold">{ph.progress}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Task</th>
                    <th className="p-3">Owner</th>
                    <th className="p-3">Dates</th>
                    <th className="p-3">Progress</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {prj.tasks.map((tsk) => (
                    <tr key={tsk.id} className="hover:bg-muted/40">
                      <td className="p-3 font-medium text-foreground">{tsk.name}</td>
                      <td className="p-3 text-muted-foreground">{tsk.owner}</td>
                      <td className="p-3 text-muted-foreground">{tsk.start} - {tsk.end}</td>
                      <td className="p-3 font-bold">{tsk.progress}%</td>
                      <td className="p-3"><StatusBadge status={tsk.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Milestone Gate</th>
                    <th className="p-3">Target Date</th>
                    <th className="p-3">Owner Lead</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {prj.milestones.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/40">
                      <td className="p-3 font-semibold text-foreground">{m.name}</td>
                      <td className="p-3 font-mono">{m.date}</td>
                      <td className="p-3 text-muted-foreground">{m.owner}</td>
                      <td className="p-3"><StatusBadge status={m.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Resource Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Allocation</th>
                    <th className="p-3">Daily Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {prj.resources.map((res) => (
                    <tr key={res.id} className="hover:bg-muted/40">
                      <td className="p-3 font-semibold text-foreground">{res.name}</td>
                      <td className="p-3 text-muted-foreground">{res.role}</td>
                      <td className="p-3 font-bold">{res.allocation}%</td>
                      <td className="p-3 font-mono">${res.rate}/day</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks">
          <Card>
            <CardContent className="p-4 space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-foreground mb-2">Project Risks ({projectRisks.length})</h4>
                <div className="space-y-2">
                  {projectRisks.map((r) => (
                    <div key={r.id} className="p-2.5 rounded border border-border flex justify-between items-center">
                      <div>
                        <span className="font-mono text-primary font-bold mr-2">{r.code}</span>
                        <span className="font-medium text-foreground">{r.title}</span>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <h4 className="font-bold text-foreground mb-2">Project Issues ({projectIssues.length})</h4>
                <div className="space-y-2">
                  {projectIssues.map((iss) => (
                    <div key={iss.id} className="p-2.5 rounded border border-border flex justify-between items-center">
                      <div>
                        <span className="font-mono text-primary font-bold mr-2">{iss.code}</span>
                        <span className="font-medium text-foreground">{iss.title}</span>
                      </div>
                      <StatusBadge status={iss.status} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Document Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Uploaded</th>
                    <th className="p-3">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {prj.documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-muted/40">
                      <td className="p-3 font-semibold text-primary">{doc.name}</td>
                      <td className="p-3">{doc.type}</td>
                      <td className="p-3 font-mono">{doc.uploaded}</td>
                      <td className="p-3 text-muted-foreground">{doc.owner}</td>
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
              {prj.activity.map((a, i) => (
                <div key={i} className="flex items-start justify-between text-xs pb-2 border-b border-border/50">
                  <div>
                    <span className="font-semibold text-foreground block">{a.action}</span>
                    <span className="text-muted-foreground text-[11px]">Actor: {a.actor}</span>
                  </div>
                  <span className="text-muted-foreground font-mono">{a.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

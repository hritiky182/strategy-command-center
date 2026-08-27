import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDb, riskService, issueService } from "@/services/store";
import { Plus, AlertTriangle, ShieldAlert, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { Risk, Issue, RiskStatus } from "@/lib/types";

export const RisksIssuesPage: React.FC = () => {
  const db = useDb();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    entity: "Project" as "Initiative" | "Project",
    entityId: db.projects[0]?.id ?? "PRJ-001",
    category: "Delivery",
    probability: 3,
    impact: 4,
    owner: "Dr. Amina Al Farsi",
    mitigation: "",
    dueDate: "2026-10-15",
    status: "open" as RiskStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Risk title is required.");
      return;
    }
    riskService.create(formData);
    toast.success("Risk logged successfully.");
    setModalOpen(false);
  };

  const handleEscalate = (id: string) => {
    riskService.update(id, { status: "escalated" });
    toast.warning("Risk escalated to Enterprise Governance Board.");
  };

  const riskColumns: Column<Risk>[] = [
    { key: "code", header: "Risk ID", sortable: true, className: "font-mono font-bold text-xs text-primary" },
    { key: "title", header: "Risk Title", sortable: true, accessor: (r) => <span className="font-semibold text-xs text-foreground">{r.title}</span> },
    { key: "category", header: "Category", sortable: true },
    { key: "probability", header: "Prob (1-5)", sortable: true, className: "text-center font-mono font-bold" },
    { key: "impact", header: "Imp (1-5)", sortable: true, className: "text-center font-mono font-bold" },
    {
      key: "score",
      header: "Score",
      sortable: true,
      className: "text-center",
      accessor: (r) => {
        const score = r.probability * r.impact;
        return (
          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
            score >= 16 ? "bg-rose-500/20 text-rose-600" : score >= 9 ? "bg-amber-500/20 text-amber-600" : "bg-emerald-500/20 text-emerald-600"
          }`}>
            {score}
          </span>
        );
      },
    },
    { key: "owner", header: "Risk Owner", sortable: true },
    { key: "status", header: "Status", sortable: true, accessor: (r) => <StatusBadge status={r.status} /> },
  ];

  const issueColumns: Column<Issue>[] = [
    { key: "code", header: "Issue ID", sortable: true, className: "font-mono font-bold text-xs text-primary" },
    { key: "title", header: "Issue Description", sortable: true, accessor: (i) => <span className="font-semibold text-xs text-foreground">{i.title}</span> },
    { key: "priority", header: "Priority", sortable: true, accessor: (i) => <StatusBadge status={i.priority} /> },
    { key: "owner", header: "Owner", sortable: true },
    { key: "status", header: "Status", sortable: true, accessor: (i) => <StatusBadge status={i.status} /> },
  ];

  // 5x5 Heatmap Matrix computation
  const heatmapGrid = Array.from({ length: 5 }, (_, impIdx) => {
    const impactVal = 5 - impIdx; // 5 down to 1
    return Array.from({ length: 5 }, (_, probIdx) => {
      const probVal = probIdx + 1; // 1 up to 5
      const count = db.risks.filter((r) => r.probability === probVal && r.impact === impactVal).length;
      const score = probVal * impactVal;
      return { probVal, impactVal, score, count };
    });
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risks & Issues Governance"
        subtitle="Enterprise risk matrix, 5x5 heatmap assessment, and issue escalation framework."
        breadcrumbs={[{ label: "Risks & Issues" }]}
        actions={
          <div className="flex gap-2">
            <ExportButton filename="enterprise_risks.csv" data={db.risks} />
            <Button size="sm" onClick={() => setModalOpen(true)} className="h-9 gap-1.5 text-xs">
              <Plus className="w-4 h-4" /> Log Risk
            </Button>
          </div>
        }
      />

      {/* 5x5 Heatmap Visual Matrix Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-primary" /> 5x5 Enterprise Risk Heatmap Matrix
          </CardTitle>
          <CardDescription className="text-xs">Distribution of risks by Probability vs Impact</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="max-w-xl mx-auto space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase px-8">
              <span>Low Prob</span>
              <span>High Prob &rarr;</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {heatmapGrid.flatMap((row) =>
                row.map((cell) => {
                  const colorClass =
                    cell.score >= 16
                      ? "bg-rose-500/20 text-rose-700 border-rose-500/40 hover:bg-rose-500/30"
                      : cell.score >= 9
                        ? "bg-amber-500/20 text-amber-700 border-amber-500/40 hover:bg-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-700 border-emerald-500/40 hover:bg-emerald-500/30";

                  return (
                    <div
                      key={`${cell.impactVal}-${cell.probVal}`}
                      className={`h-14 rounded-lg border p-2 flex flex-col justify-between items-center transition-colors ${colorClass}`}
                    >
                      <span className="text-[10px] font-mono opacity-80">P{cell.probVal} x I{cell.impactVal}</span>
                      <span className="text-lg font-extrabold">{cell.count}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risks & Issues Tabs */}
      <Tabs defaultValue="risks" className="space-y-4">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="risks" className="text-xs">Risk Register ({db.risks.length})</TabsTrigger>
          <TabsTrigger value="issues" className="text-xs">Issue Log ({db.issues.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="risks">
          <DataTable
            data={db.risks}
            columns={riskColumns}
            searchPlaceholder="Search risks by code, title, owner..."
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Open", value: "open" },
                  { label: "Escalated", value: "escalated" },
                  { label: "Mitigating", value: "mitigating" },
                  { label: "Closed", value: "closed" },
                ],
              },
            ]}
            actions={(r) => (
              r.status !== "escalated" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px] text-rose-600 hover:bg-rose-50 border-rose-200"
                  onClick={() => handleEscalate(r.id)}
                >
                  Escalate
                </Button>
              ) : (
                <span className="text-[11px] font-semibold text-rose-600">Escalated</span>
              )
            )}
          />
        </TabsContent>

        <TabsContent value="issues">
          <DataTable
            data={db.issues}
            columns={issueColumns}
            searchPlaceholder="Search issues..."
            filters={[
              {
                key: "priority",
                label: "Priority",
                options: [
                  { label: "Critical", value: "critical" },
                  { label: "High", value: "high" },
                  { label: "Medium", value: "medium" },
                ],
              },
            ]}
          />
        </TabsContent>
      </Tabs>

      {/* Log Risk Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Enterprise Risk</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label>Risk Title *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>Owner</Label>
                <Input value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Probability (1-5)</Label>
                <Input type="number" min={1} max={5} value={formData.probability} onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>Impact (1-5)</Label>
                <Input type="number" min={1} max={5} value={formData.impact} onChange={(e) => setFormData({ ...formData, impact: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Mitigation Strategy Plan</Label>
              <Textarea rows={3} value={formData.mitigation} onChange={(e) => setFormData({ ...formData, mitigation: e.target.value })} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Risk</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
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
import { useDb, correctiveActionService } from "@/services/store";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { CorrectiveAction } from "@/lib/types";

export const CorrectiveActionsPage: React.FC = () => {
  const db = useDb();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    kpiId: "KPI-001",
    description: "",
    owner: "Dr. Amina Al Farsi",
    dueDate: "2026-09-30",
    status: "open" as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      toast.error("Description is required.");
      return;
    }
    correctiveActionService.create(formData);
    toast.success("Corrective action plan created.");
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this action plan?")) {
      correctiveActionService.remove(id);
      toast.success("Corrective action removed.");
    }
  };

  const columns: Column<CorrectiveAction>[] = [
    { key: "code", header: "Code", sortable: true, className: "font-mono font-bold text-xs text-primary" },
    {
      key: "kpiId",
      header: "KPI Affected",
      sortable: true,
      accessor: (ca) => {
        const kpi = db.kpis.find((k) => k.id === ca.kpiId);
        return <span className="font-semibold text-xs text-foreground">{kpi?.name ?? ca.kpiId}</span>;
      },
    },
    { key: "description", header: "Action Recovery Plan", accessor: (ca) => <span className="line-clamp-2 text-xs">{ca.description}</span> },
    { key: "owner", header: "Action Owner", sortable: true },
    { key: "dueDate", header: "Due Date", sortable: true },
    { key: "status", header: "Status", sortable: true, accessor: (ca) => <StatusBadge status={ca.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Corrective Action Plans"
        subtitle="Intervention plans and recovery tracking for off-track KPIs and performance gaps."
        breadcrumbs={[{ label: "Performance", href: "/performance" }, { label: "Corrective Actions" }]}
        actions={
          <div className="flex gap-2">
            <ExportButton filename="corrective_actions.csv" data={db.correctiveActions} />
            <Button size="sm" onClick={() => setModalOpen(true)} className="h-9 gap-1.5 text-xs">
              <Plus className="w-4 h-4" /> Create Action Plan
            </Button>
          </div>
        }
      />

      <DataTable
        data={db.correctiveActions}
        columns={columns}
        searchPlaceholder="Search action plans..."
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Open", value: "open" },
              { label: "In Progress", value: "in-progress" },
              { label: "Completed", value: "completed" },
              { label: "Overdue", value: "overdue" },
            ],
          },
        ]}
        actions={(ca) => (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-rose-500 hover:text-rose-600"
            onClick={() => handleDelete(ca.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Corrective Action Plan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label>Target KPI</Label>
              <Select value={formData.kpiId} onValueChange={(val) => setFormData({ ...formData, kpiId: val })}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {db.kpis.map((k) => (
                    <SelectItem key={k.id} value={k.id}>
                      {k.code} - {k.name} ({k.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Action Owner</Label>
                <Input value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>Due Date</Label>
                <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Recovery Action Description</Label>
              <Textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Plan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

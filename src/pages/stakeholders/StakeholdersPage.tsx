import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useDb, stakeholderService } from "@/services/store";
import { Plus, Users, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Stakeholder } from "@/lib/types";

export const StakeholdersPage: React.FC = () => {
  const db = useDb();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    department: "Digital Services",
    role: "Sponsor",
    influence: 4,
    interest: 5,
    engagement: "champion" as const,
    owner: "Dr. Amina Al Farsi",
    frequency: "Weekly",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    stakeholderService.create(formData);
    toast.success("Stakeholder registered successfully.");
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete stakeholder record?")) {
      stakeholderService.remove(id);
      toast.success("Stakeholder removed.");
    }
  };

  const columns: Column<Stakeholder>[] = [
    { key: "name", header: "Name", sortable: true, accessor: (s) => <span className="font-semibold text-xs text-foreground">{s.name}</span> },
    { key: "role", header: "Governance Role", sortable: true },
    { key: "department", header: "Department", sortable: true },
    { key: "influence", header: "Influence (1-5)", sortable: true, className: "text-center font-mono font-bold" },
    { key: "interest", header: "Interest (1-5)", sortable: true, className: "text-center font-mono font-bold" },
    { key: "engagement", header: "Engagement", sortable: true, accessor: (s) => <StatusBadge status={s.engagement} /> },
    { key: "frequency", header: "Reporting Cadence", sortable: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stakeholder Governance & Engagement"
        subtitle="Manage key executive stakeholders, power/interest mapping, and engagement cadences."
        breadcrumbs={[{ label: "Stakeholders" }]}
        actions={
          <div className="flex gap-2">
            <ExportButton filename="stakeholders.csv" data={db.stakeholders} />
            <Button size="sm" onClick={() => setModalOpen(true)} className="h-9 gap-1.5 text-xs">
              <Plus className="w-4 h-4" /> Add Stakeholder
            </Button>
          </div>
        }
      />

      {/* 2x2 Power Interest Grid */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Influence vs Interest Matrix (2x2 Grid)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* High Influence / High Interest */}
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 block uppercase">Manage Closely (High Inf / High Int)</span>
              <p className="text-[11px] text-muted-foreground">
                {db.stakeholders.filter((s) => s.influence >= 4 && s.interest >= 4).map((s) => s.name).join(", ") || "None"}
              </p>
            </div>

            {/* High Influence / Low Interest */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-2">
              <span className="font-bold text-xs text-blue-700 dark:text-blue-400 block uppercase">Keep Satisfied (High Inf / Low Int)</span>
              <p className="text-[11px] text-muted-foreground">
                {db.stakeholders.filter((s) => s.influence >= 4 && s.interest < 4).map((s) => s.name).join(", ") || "None"}
              </p>
            </div>

            {/* Low Influence / High Interest */}
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-2">
              <span className="font-bold text-xs text-amber-700 dark:text-amber-400 block uppercase">Keep Informed (Low Inf / High Int)</span>
              <p className="text-[11px] text-muted-foreground">
                {db.stakeholders.filter((s) => s.influence < 4 && s.interest >= 4).map((s) => s.name).join(", ") || "None"}
              </p>
            </div>

            {/* Low Influence / Low Interest */}
            <div className="p-4 rounded-lg bg-muted border border-border space-y-2">
              <span className="font-bold text-xs text-muted-foreground block uppercase">Monitor (Low Inf / Low Int)</span>
              <p className="text-[11px] text-muted-foreground">
                {db.stakeholders.filter((s) => s.influence < 4 && s.interest < 4).map((s) => s.name).join(", ") || "None"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        data={db.stakeholders}
        columns={columns}
        searchPlaceholder="Search stakeholders..."
        actions={(s) => (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-500" onClick={() => handleDelete(s.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Register Stakeholder</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label>Stakeholder Name *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Influence (1-5)</Label>
                <Input type="number" min={1} max={5} value={formData.influence} onChange={(e) => setFormData({ ...formData, influence: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>Interest (1-5)</Label>
                <Input type="number" min={1} max={5} value={formData.interest} onChange={(e) => setFormData({ ...formData, interest: Number(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Stakeholder</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

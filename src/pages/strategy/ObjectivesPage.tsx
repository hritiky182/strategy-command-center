import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useDb, strategyService } from "@/services/store";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Objective, Status } from "@/lib/types";

export const ObjectivesPage: React.FC = () => {
  const navigate = useNavigate();
  const db = useDb();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    pillarId: "P1",
    owner: "Dr. Amina Al Farsi",
    department: "Digital Services",
    weight: 10,
    performance: 75,
    status: "on-track" as Status,
    description: "",
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      pillarId: "P1",
      owner: "Dr. Amina Al Farsi",
      department: "Digital Services",
      weight: 10,
      performance: 75,
      status: "on-track",
      description: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (obj: Objective) => {
    setEditingId(obj.id);
    setFormData({
      name: obj.name,
      pillarId: obj.pillarId,
      owner: obj.owner,
      department: obj.department,
      weight: obj.weight,
      performance: obj.performance,
      status: obj.status,
      description: obj.description,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Objective name is required.");
      return;
    }

    if (editingId) {
      strategyService.updateObjective(editingId, formData);
      toast.success("Strategic Objective updated successfully.");
    } else {
      strategyService.createObjective({
        ...formData,
        startDate: "2026-01-01",
        endDate: "2026-12-31",
      });
      toast.success("Strategic Objective created successfully.");
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete objective "${name}"?`)) {
      strategyService.deleteObjective(id);
      toast.success("Objective deleted.");
    }
  };

  const columns: Column<Objective>[] = [
    {
      key: "code",
      header: "Code",
      sortable: true,
      className: "font-mono text-xs font-semibold w-24 text-primary",
    },
    {
      key: "name",
      header: "Objective Name",
      sortable: true,
      accessor: (obj) => (
        <div>
          <span className="font-semibold text-foreground block">{obj.name}</span>
          <span className="text-[11px] text-muted-foreground line-clamp-1">{obj.description}</span>
        </div>
      ),
    },
    {
      key: "pillarId",
      header: "Strategic Pillar",
      sortable: true,
      accessor: (obj) => {
        const pillar = db.pillars.find((p) => p.id === obj.pillarId);
        return <span className="text-xs font-medium">{pillar?.name ?? obj.pillarId}</span>;
      },
    },
    { key: "owner", header: "Owner", sortable: true },
    { key: "department", header: "Department", sortable: true },
    {
      key: "weight",
      header: "Weight",
      sortable: true,
      className: "text-center",
      accessor: (obj) => <span className="font-mono text-xs">{obj.weight}%</span>,
    },
    {
      key: "performance",
      header: "Score",
      sortable: true,
      className: "text-center",
      accessor: (obj) => <span className="font-bold text-xs">{obj.performance}%</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (obj) => <StatusBadge status={obj.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Strategic Objectives"
        subtitle="Manage national objectives cascaded across departments and strategic pillars."
        breadcrumbs={[{ label: "Strategy Management", href: "/strategy" }, { label: "Objectives" }]}
        actions={
          <div className="flex gap-2">
            <ExportButton filename="strategic_objectives.csv" data={db.objectives} />
            <Button size="sm" onClick={handleOpenAdd} className="h-9 gap-1.5 text-xs">
              <Plus className="w-4 h-4" /> Add Objective
            </Button>
          </div>
        }
      />

      <DataTable
        data={db.objectives}
        columns={columns}
        searchPlaceholder="Search objectives by code, name, department..."
        onRowClick={(obj) => navigate(`/strategy/objectives/${obj.id}`)}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "On Track", value: "on-track" },
              { label: "At Risk", value: "at-risk" },
              { label: "Off Track", value: "off-track" },
            ],
          },
        ]}
        actions={(obj) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(`/strategy/objectives/${obj.id}`)}
              title="View Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => handleOpenEdit(obj)}
              title="Edit Objective"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:text-rose-600"
              onClick={() => handleDelete(obj.id, obj.name)}
              title="Delete Objective"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      {/* Modal Form for Add/Edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Strategic Objective" : "Create Strategic Objective"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label>Objective Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Achieve 100% digital service availability"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Strategic Pillar</Label>
                <Select
                  value={formData.pillarId}
                  onValueChange={(val) => setFormData({ ...formData, pillarId: val })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {db.pillars.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.code} - {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Department</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Owner</Label>
                <Input
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Weight (%)</Label>
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-track">On Track</SelectItem>
                    <SelectItem value="at-risk">At Risk</SelectItem>
                    <SelectItem value="off-track">Off Track</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter objective scope, target outcomes, and governance framework..."
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Objective</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

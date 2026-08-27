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
import { useDb, initiativeService } from "@/services/store";
import { Plus, Eye, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Initiative, Status } from "@/lib/types";

export const InitiativesPage: React.FC = () => {
  const navigate = useNavigate();
  const db = useDb();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    objectiveId: "OBJ-01",
    owner: "Dr. Amina Al Farsi",
    department: "Digital Services",
    progress: 50,
    status: "on-track" as Status,
    startDate: "2026-01-15",
    endDate: "2027-06-30",
    budget: 15000000,
    actualCost: 6500000,
    description: "",
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      objectiveId: "OBJ-01",
      owner: "Dr. Amina Al Farsi",
      department: "Digital Services",
      progress: 50,
      status: "on-track",
      startDate: "2026-01-15",
      endDate: "2027-06-30",
      budget: 15000000,
      actualCost: 6500000,
      description: "",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Initiative name is required.");
      return;
    }

    if (editingId) {
      initiativeService.update(editingId, formData);
      toast.success("Initiative updated successfully.");
    } else {
      initiativeService.create(formData);
      toast.success("Strategic Initiative created successfully.");
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete initiative "${name}"?`)) {
      initiativeService.remove(id);
      toast.success("Initiative removed.");
    }
  };

  const columns: Column<Initiative>[] = [
    {
      key: "code",
      header: "Code",
      sortable: true,
      className: "font-mono text-xs font-semibold w-24 text-primary",
    },
    {
      key: "name",
      header: "Initiative Name",
      sortable: true,
      accessor: (ini) => (
        <div>
          <span className="font-semibold text-foreground block">{ini.name}</span>
          <span className="text-[11px] text-muted-foreground line-clamp-1">{ini.description}</span>
        </div>
      ),
    },
    {
      key: "objectiveId",
      header: "Strategic Objective",
      sortable: true,
      accessor: (ini) => {
        const obj = db.objectives.find((o) => o.id === ini.objectiveId);
        return <span className="text-xs font-medium">{obj?.code ?? ini.objectiveId}</span>;
      },
    },
    { key: "owner", header: "Owner", sortable: true },
    {
      key: "progress",
      header: "Progress",
      sortable: true,
      accessor: (ini) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-secondary h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: `${ini.progress}%` }} />
          </div>
          <span className="font-semibold text-xs">{ini.progress}%</span>
        </div>
      ),
    },
    {
      key: "budget",
      header: "Budget",
      sortable: true,
      accessor: (ini) => <span className="font-mono text-xs">${(ini.budget / 1_000_000).toFixed(1)}M</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (ini) => <StatusBadge status={ini.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Strategic Initiatives"
        subtitle="Manage national programmes and strategic execution initiatives."
        breadcrumbs={[{ label: "Strategy Management", href: "/strategy" }, { label: "Initiatives" }]}
        actions={
          <div className="flex gap-2">
            <ExportButton filename="strategic_initiatives.csv" data={db.initiatives} />
            <Button size="sm" onClick={handleOpenAdd} className="h-9 gap-1.5 text-xs">
              <Plus className="w-4 h-4" /> Add Initiative
            </Button>
          </div>
        }
      />

      <DataTable
        data={db.initiatives}
        columns={columns}
        searchPlaceholder="Search initiatives by code, name, owner..."
        onRowClick={(ini) => navigate(`/strategy/initiatives/${ini.id}`)}
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
        actions={(ini) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(`/strategy/initiatives/${ini.id}`)}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:text-rose-600"
              onClick={() => handleDelete(ini.id, ini.name)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      {/* Add Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Strategic Initiative</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label>Initiative Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. National Unified Services Platform Programme"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Strategic Objective</Label>
                <Select
                  value={formData.objectiveId}
                  onValueChange={(val) => setFormData({ ...formData, objectiveId: val })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {db.objectives.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.code} - {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Owner</Label>
                <Input
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Progress (%)</Label>
                <Input
                  type="number"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Budget ($)</Label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
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
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Initiative</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

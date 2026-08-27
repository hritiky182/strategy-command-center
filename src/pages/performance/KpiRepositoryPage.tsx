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
import { useDb, kpiService } from "@/services/store";
import { Plus, Eye, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Kpi, Status, KpiType, KpiFrequency } from "@/lib/types";

export const KpiRepositoryPage: React.FC = () => {
  const navigate = useNavigate();
  const db = useDb();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    definition: "",
    formula: "",
    type: "leading" as KpiType,
    objectiveId: "OBJ-01",
    owner: "Dr. Amina Al Farsi",
    department: "Digital Services",
    sector: "Digital Government Sector",
    dataSource: "Service Platform",
    frequency: "monthly" as KpiFrequency,
    unit: "%",
    baseline: 70,
    target: 95,
    actual: 88,
    weight: 5,
    polarity: "increase" as "increase" | "decrease",
    status: "on-track" as Status,
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      definition: "",
      formula: "(Actual / Target) * 100",
      type: "leading",
      objectiveId: "OBJ-01",
      owner: "Dr. Amina Al Farsi",
      department: "Digital Services",
      sector: "Digital Government Sector",
      dataSource: "Service Platform",
      frequency: "monthly",
      unit: "%",
      baseline: 70,
      target: 95,
      actual: 88,
      weight: 5,
      polarity: "increase",
      status: "on-track",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("KPI name is required.");
      return;
    }

    if (editingId) {
      kpiService.update(editingId, formData);
      toast.success("KPI updated successfully.");
    } else {
      kpiService.create(formData);
      toast.success("KPI created successfully.");
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete KPI "${name}"?`)) {
      kpiService.remove(id);
      toast.success("KPI removed.");
    }
  };

  const columns: Column<Kpi>[] = [
    {
      key: "code",
      header: "KPI Code",
      sortable: true,
      className: "font-mono text-xs font-semibold w-24 text-primary",
    },
    {
      key: "name",
      header: "KPI Name",
      sortable: true,
      accessor: (k) => (
        <div>
          <span className="font-semibold text-foreground block">{k.name}</span>
          <span className="text-[11px] text-muted-foreground">{k.department} • {k.frequency}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      accessor: (k) => (
        <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded ${
          k.type === "leading" ? "bg-blue-500/15 text-blue-600" : "bg-purple-500/15 text-purple-600"
        }`}>
          {k.type}
        </span>
      ),
    },
    { key: "target", header: "Target", sortable: true, accessor: (k) => `${k.target} ${k.unit}` },
    { key: "actual", header: "Actual", sortable: true, accessor: (k) => <span className="font-bold">{k.actual} {k.unit}</span> },
    {
      key: "achievement",
      header: "Achievement",
      sortable: true,
      accessor: (k) => {
        const ach = kpiService.achievement(k);
        return <span className="font-mono text-xs font-bold">{ach}%</span>;
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (k) => <StatusBadge status={k.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="KPI Repository"
        subtitle="Centralized dictionary and performance registry of enterprise indicators."
        breadcrumbs={[{ label: "Performance", href: "/performance" }, { label: "KPI Repository" }]}
        actions={
          <div className="flex gap-2">
            <ExportButton filename="kpi_repository.csv" data={db.kpis} />
            <Button size="sm" onClick={handleOpenAdd} className="h-9 gap-1.5 text-xs">
              <Plus className="w-4 h-4" /> Add KPI
            </Button>
          </div>
        }
      />

      <DataTable
        data={db.kpis}
        columns={columns}
        searchPlaceholder="Search KPIs by code, name, department, source..."
        onRowClick={(k) => navigate(`/performance/kpis/${k.id}`)}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "On Track", value: "on-track" },
              { label: "At Risk", value: "at-risk" },
              { label: "Off Track", value: "off-track" },
              { label: "Not Reported", value: "not-reported" },
            ],
          },
          {
            key: "type",
            label: "Type",
            options: [
              { label: "Leading", value: "leading" },
              { label: "Lagging", value: "lagging" },
            ],
          },
        ]}
        actions={(k) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(`/performance/kpis/${k.id}`)}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:text-rose-600"
              onClick={() => handleDelete(k.id, k.name)}
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
            <DialogTitle>Create KPI Definition</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label>KPI Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <Label>Indicator Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val: any) => setFormData({ ...formData, type: val })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leading">Leading</SelectItem>
                    <SelectItem value="lagging">Lagging</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Baseline</Label>
                <Input
                  type="number"
                  value={formData.baseline}
                  onChange={(e) => setFormData({ ...formData, baseline: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Target</Label>
                <Input
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Actual</Label>
                <Input
                  type="number"
                  value={formData.actual}
                  onChange={(e) => setFormData({ ...formData, actual: Number(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save KPI</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

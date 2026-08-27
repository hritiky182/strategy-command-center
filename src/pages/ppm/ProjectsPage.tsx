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
import { useDb, projectService } from "@/services/store";
import { Plus, Eye, Edit2, Trash2, GanttChartSquare } from "lucide-react";
import { toast } from "sonner";
import type { Project, Health, Status, ProjectType } from "@/lib/types";

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const db = useDb();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    type: "digital" as ProjectType,
    portfolioId: "PF-01",
    initiativeId: "INI-01",
    manager: "Dr. Amina Al Farsi",
    department: "Digital Services",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    progress: 45,
    budget: 25000000,
    plannedCost: 22000000,
    actualCost: 11000000,
    health: "green" as Health,
    status: "on-track" as Status,
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      code: `PRJ-${String(db.projects.length + 1).padStart(3, "0")}`,
      description: "",
      type: "digital",
      portfolioId: "PF-01",
      initiativeId: "INI-01",
      manager: "Dr. Amina Al Farsi",
      department: "Digital Services",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      progress: 45,
      budget: 25000000,
      plannedCost: 22000000,
      actualCost: 11000000,
      health: "green",
      status: "on-track",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Project name is required.");
      return;
    }

    if (editingId) {
      projectService.update(editingId, formData);
      toast.success("Project updated successfully.");
    } else {
      projectService.create(formData);
      toast.success("Project created successfully.");
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete project "${name}"?`)) {
      projectService.remove(id);
      toast.success("Project deleted.");
    }
  };

  const columns: Column<Project>[] = [
    {
      key: "code",
      header: "Code",
      sortable: true,
      className: "font-mono text-xs font-semibold w-24 text-primary",
    },
    {
      key: "name",
      header: "Project Name",
      sortable: true,
      accessor: (p) => (
        <div>
          <span className="font-semibold text-foreground block">{p.name}</span>
          <span className="text-[11px] text-muted-foreground">{p.department} • Lead: {p.manager}</span>
        </div>
      ),
    },
    {
      key: "portfolioId",
      header: "Portfolio",
      sortable: true,
      accessor: (p) => {
        const pf = db.portfolios.find((x) => x.id === p.portfolioId);
        return <span className="text-xs font-medium">{pf?.name ?? p.portfolioId}</span>;
      },
    },
    {
      key: "progress",
      header: "Progress",
      sortable: true,
      accessor: (p) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-secondary h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: `${p.progress}%` }} />
          </div>
          <span className="font-bold text-xs">{p.progress}%</span>
        </div>
      ),
    },
    {
      key: "budget",
      header: "Budget / Actual",
      sortable: true,
      accessor: (p) => (
        <span className="font-mono text-xs">
          ${(p.actualCost / 1_000_000).toFixed(1)}M / ${(p.budget / 1_000_000).toFixed(1)}M
        </span>
      ),
    },
    {
      key: "health",
      header: "Health",
      sortable: true,
      accessor: (p) => <StatusBadge status={p.health} />,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (p) => <StatusBadge status={p.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Management"
        subtitle="Master directory of enterprise execution projects, progress, spend & delivery health."
        breadcrumbs={[{ label: "Projects & Portfolios", href: "/portfolios" }, { label: "Projects" }]}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate("/projects/plan")} className="h-9 gap-1.5 text-xs">
              <GanttChartSquare className="w-4 h-4" /> Interactive Gantt Plan
            </Button>
            <ExportButton filename="projects_master.csv" data={db.projects} />
            <Button size="sm" onClick={handleOpenAdd} className="h-9 gap-1.5 text-xs">
              <Plus className="w-4 h-4" /> Add Project
            </Button>
          </div>
        }
      />

      <DataTable
        data={db.projects}
        columns={columns}
        searchPlaceholder="Search projects by code, name, manager, department..."
        onRowClick={(p) => navigate(`/projects/${p.id}`)}
        filters={[
          {
            key: "health",
            label: "Health",
            options: [
              { label: "Green", value: "green" },
              { label: "Amber", value: "amber" },
              { label: "Red", value: "red" },
            ],
          },
          {
            key: "status",
            label: "Status",
            options: [
              { label: "On Track", value: "on-track" },
              { label: "Planned", value: "planned" },
              { label: "Completed", value: "completed" },
            ],
          },
        ]}
        actions={(p) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:text-rose-600"
              onClick={() => handleDelete(p.id, p.name)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Enterprise Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label>Project Title *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Portfolio</Label>
                <Select value={formData.portfolioId} onValueChange={(val) => setFormData({ ...formData, portfolioId: val })}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {db.portfolios.map((pf) => <SelectItem key={pf.id} value={pf.id}>{pf.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Manager Lead</Label>
                <Input value={formData.manager} onChange={(e) => setFormData({ ...formData, manager: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Budget ($)</Label>
                <Input type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>Progress (%)</Label>
                <Input type="number" value={formData.progress} onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>Health</Label>
                <Select value={formData.health} onValueChange={(val: any) => setFormData({ ...formData, health: val })}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="amber">Amber</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { useDb } from "@/services/store";

export const MilestonesPage: React.FC = () => {
  const db = useDb();

  const allMilestones = db.projects.flatMap((p) =>
    p.milestones.map((m) => ({ ...m, projectName: p.name, projectCode: p.code }))
  );

  const columns: Column<any>[] = [
    { key: "name", header: "Milestone Gate", sortable: true, accessor: (m) => <span className="font-semibold text-xs text-foreground">{m.name}</span> },
    { key: "projectName", header: "Project", sortable: true, accessor: (m) => <span className="text-xs text-muted-foreground">{m.projectCode} • {m.projectName}</span> },
    { key: "owner", header: "Gate Owner Lead", sortable: true },
    { key: "date", header: "Target Date", sortable: true, className: "font-mono text-xs font-bold" },
    { key: "status", header: "Status", sortable: true, accessor: (m) => <StatusBadge status={m.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Milestones & Governance Deliverables"
        subtitle="National gateway milestones, governance sign-offs, and critical review points."
        breadcrumbs={[{ label: "Projects & Portfolios", href: "/portfolios" }, { label: "Milestones" }]}
        actions={<ExportButton filename="project_milestones.csv" data={allMilestones} />}
      />

      <DataTable
        data={allMilestones}
        columns={columns}
        searchPlaceholder="Search milestones by name, owner, project..."
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Completed", value: "completed" },
              { label: "Planned", value: "planned" },
              { label: "At Risk", value: "at-risk" },
            ],
          },
        ]}
      />
    </div>
  );
};

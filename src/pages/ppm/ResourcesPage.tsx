import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { ExportButton } from "@/components/common/ExportButton";
import { useDb } from "@/services/store";

export const ResourcesPage: React.FC = () => {
  const db = useDb();

  const allResources = db.projects.flatMap((p) =>
    p.resources.map((r) => ({ ...r, projectName: p.name, projectCode: p.code }))
  );

  const columns: Column<any>[] = [
    { key: "name", header: "Resource Name", sortable: true, accessor: (r) => <span className="font-semibold text-xs text-foreground">{r.name}</span> },
    { key: "role", header: "Role", sortable: true },
    { key: "department", header: "Department", sortable: true },
    { key: "projectName", header: "Assigned Project", sortable: true, accessor: (r) => <span className="text-xs text-muted-foreground">{r.projectCode} • {r.projectName}</span> },
    { key: "allocation", header: "Allocation", sortable: true, accessor: (r) => <span className="font-bold text-xs">{r.allocation}%</span> },
    { key: "rate", header: "Daily Rate", sortable: true, accessor: (r) => <span className="font-mono text-xs">${r.rate}/day</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resource Capacity & Allocation"
        subtitle="Human capital resource allocation across strategic initiatives and projects."
        breadcrumbs={[{ label: "Projects & Portfolios", href: "/portfolios" }, { label: "Resources" }]}
        actions={<ExportButton filename="resource_allocations.csv" data={allResources} />}
      />

      <DataTable
        data={allResources}
        columns={columns}
        searchPlaceholder="Search resources by name, role, department..."
      />
    </div>
  );
};

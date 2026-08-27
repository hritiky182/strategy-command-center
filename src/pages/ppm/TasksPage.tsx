import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDb } from "@/services/store";
import type { Task } from "@/lib/types";

export const TasksPage: React.FC = () => {
  const db = useDb();

  const allTasks = db.projects.flatMap((p) =>
    p.tasks.map((t) => ({ ...t, projectName: p.name, projectCode: p.code }))
  );

  const columns: Column<any>[] = [
    { key: "name", header: "Task Name", sortable: true, accessor: (t) => <span className="font-semibold text-xs text-foreground">{t.name}</span> },
    { key: "projectName", header: "Project", sortable: true, accessor: (t) => <span className="text-xs text-muted-foreground">{t.projectCode} • {t.projectName}</span> },
    { key: "owner", header: "Owner", sortable: true },
    { key: "end", header: "Due Date", sortable: true, className: "font-mono text-xs" },
    { key: "progress", header: "Progress", sortable: true, accessor: (t) => <span className="font-bold text-xs">{t.progress}%</span> },
    { key: "status", header: "Status", sortable: true, accessor: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Tasks Master"
        subtitle="Operational tasks, work breakdown structure items, and status tracking."
        breadcrumbs={[{ label: "Projects & Portfolios", href: "/portfolios" }, { label: "Tasks" }]}
        actions={<ExportButton filename="project_tasks.csv" data={allTasks} />}
      />

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="list" className="text-xs">Data Table View</TabsTrigger>
          <TabsTrigger value="kanban" className="text-xs">Kanban Board View</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <DataTable
            data={allTasks}
            columns={columns}
            searchPlaceholder="Search tasks by name, owner, project..."
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "On Track", value: "on-track" },
                  { label: "Completed", value: "completed" },
                  { label: "Planned", value: "planned" },
                ],
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["planned", "on-track", "completed"].map((st) => {
              const tasksInCol = allTasks.filter((t) => t.status === st);
              return (
                <div key={st} className="bg-muted/40 rounded-lg p-4 border border-border space-y-3">
                  <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
                    <span>{st.replace("-", " ")}</span>
                    <span className="px-2 py-0.5 rounded bg-background text-foreground font-mono">{tasksInCol.length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {tasksInCol.map((t) => (
                      <Card key={t.id} className="p-3 space-y-2 text-xs">
                        <div className="flex justify-between font-semibold text-foreground">
                          <span>{t.name}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{t.projectName}</p>
                        <div className="flex items-center justify-between text-[10px] pt-2 border-t border-border">
                          <span>{t.owner}</span>
                          <span className="font-mono">{t.end}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

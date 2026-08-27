import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { Button } from "@/components/ui/button";
import { useDb, approvalService } from "@/services/store";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { ApprovalRequest } from "@/lib/types";

export const WorkflowsPage: React.FC = () => {
  const db = useDb();

  const handleApprove = (id: string, title: string) => {
    approvalService.approve(id, "Approved by Executive Committee.");
    toast.success(`Request approved: "${title}"`);
  };

  const handleReject = (id: string, title: string) => {
    approvalService.reject(id, "Rejected. More information required.");
    toast.error(`Request rejected: "${title}"`);
  };

  const columns: Column<ApprovalRequest>[] = [
    { key: "code", header: "ID", sortable: true, className: "font-mono font-bold text-xs text-primary" },
    { key: "title", header: "Governance Request Title", sortable: true, accessor: (a) => <span className="font-semibold text-xs text-foreground">{a.title}</span> },
    { key: "type", header: "Type", sortable: true, accessor: (a) => <span className="uppercase text-[11px] font-semibold text-muted-foreground">{a.type}</span> },
    { key: "requester", header: "Requester", sortable: true },
    { key: "submittedAt", header: "Date", sortable: true, className: "font-mono text-xs" },
    {
      key: "amount",
      header: "Financial Value",
      sortable: true,
      accessor: (a) => (a.amount ? <span className="font-mono text-xs font-bold">${(a.amount / 1000).toFixed(0)}K</span> : "-"),
    },
    { key: "status", header: "Status", sortable: true, accessor: (a) => <StatusBadge status={a.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflows & Governance Approvals"
        subtitle="Review, approve, or reject baseline change requests, project charters, and completion certificates."
        breadcrumbs={[{ label: "Workflows & Approvals" }]}
        actions={<ExportButton filename="approvals_history.csv" data={db.approvals} />}
      />

      <DataTable
        data={db.approvals}
        columns={columns}
        searchPlaceholder="Search approvals by title, requester..."
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Submitted", value: "submitted" },
              { label: "Under Review", value: "under-review" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
            ],
          },
        ]}
        actions={(a) => (
          a.status === "submitted" || a.status === "under-review" ? (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30"
                onClick={() => handleApprove(a.id, a.title)}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 border-rose-500/30"
                onClick={() => handleReject(a.id, a.title)}
              >
                <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
              </Button>
            </div>
          ) : null
        )}
      />
    </div>
  );
};

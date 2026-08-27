import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { Button } from "@/components/ui/button";
import { useDb, userService } from "@/services/store";
import { UserCheck, Shield } from "lucide-react";
import { toast } from "sonner";
import type { User, RoleName } from "@/lib/types";

export const UsersPage: React.FC = () => {
  const db = useDb();

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    userService.update(id, { status: nextStatus as any });
    toast.success(`User status updated to ${nextStatus}.`);
  };

  const columns: Column<User>[] = [
    { key: "name", header: "Full Name", sortable: true, accessor: (u) => <span className="font-semibold text-xs text-foreground">{u.name}</span> },
    { key: "email", header: "Email Address", sortable: true, className: "font-mono text-xs" },
    { key: "role", header: "Role", sortable: true, accessor: (u) => <span className="font-bold text-xs text-primary">{u.role}</span> },
    { key: "department", header: "Department", sortable: true },
    { key: "lastLogin", header: "Last Login", sortable: true, className: "font-mono text-xs" },
    { key: "status", header: "Status", sortable: true, accessor: (u) => <StatusBadge status={u.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management & System Access"
        subtitle="Manage enterprise user accounts, department assignments, and role-based permissions."
        breadcrumbs={[{ label: "Administration", href: "/admin/users" }, { label: "Users" }]}
        actions={<ExportButton filename="system_users.csv" data={db.users} />}
      />

      <DataTable
        data={db.users}
        columns={columns}
        searchPlaceholder="Search users by name, email, department..."
        filters={[
          {
            key: "role",
            label: "Role",
            options: [
              { label: "Admin", value: "Admin" },
              { label: "Executive", value: "Executive" },
              { label: "Strategy Manager", value: "Strategy Manager" },
              { label: "Project Manager", value: "Project Manager" },
            ],
          },
        ]}
        actions={(u) => (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => handleToggleStatus(u.id, u.status)}
          >
            Toggle Status
          </Button>
        )}
      />
    </div>
  );
};

import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Check, X } from "lucide-react";
import type { RoleName } from "@/lib/types";

export const RolesPage: React.FC = () => {
  const roles: RoleName[] = [
    "Admin",
    "Executive",
    "Strategy Manager",
    "Performance Manager",
    "Project Manager",
    "Department Manager",
    "Viewer",
  ];

  const modules = [
    "Executive Dashboard",
    "Strategy & Objectives CRUD",
    "KPI Management & Scorecards",
    "Project & Portfolio Management",
    "Risks & Issues Governance",
    "Workflows & Approvals",
    "Financial Management",
    "Administration & User RBAC",
  ];

  const hasAccess = (role: RoleName, moduleIdx: number) => {
    if (role === "Admin") return true;
    if (role === "Executive") return moduleIdx !== 7; // No Admin RBAC
    if (role === "Strategy Manager") return [0, 1, 2, 4, 5, 6].includes(moduleIdx);
    if (role === "Performance Manager") return [0, 2, 4, 5, 6].includes(moduleIdx);
    if (role === "Project Manager") return [0, 3, 4, 5].includes(moduleIdx);
    if (role === "Department Manager") return [0, 1, 2, 3, 4].includes(moduleIdx);
    return moduleIdx === 0; // Viewer read-only
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions Matrix"
        subtitle="Granular RBAC entitlement matrix across system modules."
        breadcrumbs={[{ label: "Administration", href: "/admin/users" }, { label: "Roles & Permissions" }]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> System RBAC Entitlement Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-y border-border">
              <tr>
                <th className="p-3">Module / Feature</th>
                {roles.map((r) => (
                  <th key={r} className="p-3 text-center">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {modules.map((m, idx) => (
                <tr key={m} className="hover:bg-muted/30">
                  <td className="p-3 font-semibold text-foreground">{m}</td>
                  {roles.map((r) => (
                    <td key={r} className="p-3 text-center">
                      {hasAccess(r, idx) ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto font-bold" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

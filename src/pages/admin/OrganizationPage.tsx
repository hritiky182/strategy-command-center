import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDb } from "@/services/store";
import { Network, Building2, Users } from "lucide-react";

export const OrganizationPage: React.FC = () => {
  const db = useDb();

  const centerNode = db.orgNodes.find((n) => n.level === "center");
  const sectorNodes = db.orgNodes.filter((n) => n.level === "sector");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organizational Hierarchy"
        subtitle="Visual tree structure mapping Enterprise Centre → Sectors → Departments."
        breadcrumbs={[{ label: "Administration", href: "/admin/users" }, { label: "Organizational Hierarchy" }]}
      />

      {/* Organizational Hierarchy Chart */}
      <div className="space-y-6">
        {/* Top Center Node */}
        {centerNode && (
          <Card className="max-w-md mx-auto border-2 border-primary bg-primary/5 text-center shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-extrabold text-primary flex items-center justify-center gap-2">
                <Network className="w-5 h-5" /> {centerNode.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <p className="text-muted-foreground">Head: <span className="font-bold text-foreground">{centerNode.head}</span></p>
              <p className="font-mono font-bold text-emerald-600">{centerNode.performance}% Performance | {centerNode.headcount} Staff</p>
            </CardContent>
          </Card>
        )}

        {/* Sectors Level */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border">
          {sectorNodes.map((s) => {
            const depts = db.orgNodes.filter((n) => n.parentId === s.id);
            return (
              <Card key={s.id} className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" /> {s.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex justify-between text-muted-foreground border-b border-border pb-2">
                    <span>Lead: {s.head}</span>
                    <span className="font-bold font-mono text-primary">{s.performance}%</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Departments ({depts.length})</span>
                    {depts.map((d) => (
                      <div key={d.id} className="p-2 rounded bg-muted/40 flex justify-between items-center text-[11px]">
                        <span className="font-medium text-foreground">{d.name}</span>
                        <span className="font-mono font-bold">{d.performance}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

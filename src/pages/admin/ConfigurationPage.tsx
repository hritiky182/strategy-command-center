import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sliders, Save } from "lucide-react";
import { toast } from "sonner";

export const ConfigurationPage: React.FC = () => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("System configuration parameters saved.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Configuration & Thresholds"
        subtitle="Global governance tolerances, SLA thresholds, and system integration settings."
        breadcrumbs={[{ label: "Administration", href: "/admin/users" }, { label: "Configuration" }]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" /> Governance Threshold Parameters
          </CardTitle>
          <CardDescription className="text-xs">Configure system-wide RAG status calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4 text-xs max-w-xl">
            <div className="space-y-1.5">
              <Label>Green Status Tolerance Minimum (%)</Label>
              <Input type="number" defaultValue={85} />
            </div>
            <div className="space-y-1.5">
              <Label>Amber Status Tolerance Minimum (%)</Label>
              <Input type="number" defaultValue={70} />
            </div>
            <div className="space-y-1.5">
              <Label>Critical Risk Score Escalation Threshold</Label>
              <Input type="number" defaultValue={16} />
            </div>
            <div className="space-y-1.5">
              <Label>Monthly KPI Reporting Window (Day of Month)</Label>
              <Input type="number" defaultValue={25} />
            </div>
            <Button type="submit" className="gap-1.5 text-xs">
              <Save className="w-4 h-4" /> Save Parameters
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

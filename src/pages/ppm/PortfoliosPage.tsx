import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDb } from "@/services/store";
import { Briefcase, DollarSign, ArrowRight, TrendingUp } from "lucide-react";

export const PortfoliosPage: React.FC = () => {
  const navigate = useNavigate();
  const db = useDb();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Management"
        subtitle="National sector portfolio oversight, budget allocations, and health tracking."
        breadcrumbs={[{ label: "Projects & Portfolios", href: "/portfolios" }, { label: "Portfolios" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {db.portfolios.map((pf) => {
          const linkedProjects = db.projects.filter((p) => p.portfolioId === pf.id);
          const spendPct = Math.round((pf.actualCost / pf.budget) * 100);

          return (
            <Card key={pf.id} className="relative flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                    {pf.code}
                  </span>
                  <StatusBadge status={pf.health} />
                </div>
                <CardTitle className="text-base font-bold text-foreground">{pf.name}</CardTitle>
                <CardDescription className="text-xs">{pf.sector} • Lead: {pf.manager}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-lg bg-muted/40">
                  <div>
                    <span className="text-muted-foreground block">Total Budget</span>
                    <span className="font-bold text-foreground font-mono">${(pf.budget / 1_000_000).toFixed(0)}M</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Actual Spend</span>
                    <span className="font-bold text-foreground font-mono">${(pf.actualCost / 1_000_000).toFixed(0)}M ({spendPct}%)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Portfolio Performance</span>
                    <span className="font-bold text-foreground">{pf.performance}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${pf.performance}%` }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{linkedProjects.length} Execution Projects</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/projects?portfolio=${pf.id}`)}
                    className="h-8 text-xs gap-1"
                  >
                    View Projects <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

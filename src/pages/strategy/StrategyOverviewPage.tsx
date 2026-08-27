import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useDb } from "@/services/store";
import { VISION, MISSION } from "@/lib/mock-data";
import { Target, Flag, Layers, ArrowRight, GitBranch } from "lucide-react";

export const StrategyOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const db = useDb();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Strategy Overview"
        subtitle="Enterprise strategic framework, vision, strategic pillars and core performance drivers."
        breadcrumbs={[{ label: "Strategy Management", href: "/strategy" }, { label: "Overview" }]}
        actions={
          <Button size="sm" onClick={() => navigate("/strategy/map")} className="h-9 gap-1.5 text-xs">
            <GitBranch className="w-4 h-4" /> Open Strategy Map
          </Button>
        }
      />

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
              <Flag className="w-4 h-4" /> National Strategic Vision 2030
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground leading-relaxed font-medium">{VISION}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-emerald-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Target className="w-4 h-4" /> Enterprise Mission Statement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground leading-relaxed font-medium">{MISSION}</p>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Pillars Hierarchy */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Strategic Pillars ({db.pillars.length})
          </h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/strategy/objectives")} className="text-xs h-8">
            View Objectives Table
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {db.pillars.map((pillar) => {
            const linkedObjs = db.objectives.filter((o) => o.pillarId === pillar.id);
            return (
              <Card key={pillar.id} className="relative flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                      {pillar.code}
                    </span>
                    <span className="font-medium text-muted-foreground">Weight: {pillar.weight}%</span>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground">{pillar.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">{pillar.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Performance Score</span>
                      <span className="font-bold text-foreground">{pillar.performance}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${pillar.performance}%` }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-2.5">
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase mb-2">
                      Linked Objectives ({linkedObjs.length})
                    </div>
                    <div className="space-y-1.5">
                      {linkedObjs.map((obj) => (
                        <div
                          key={obj.id}
                          onClick={() => navigate(`/strategy/objectives/${obj.id}`)}
                          className="flex items-center justify-between p-2 rounded-md bg-muted/40 hover:bg-accent cursor-pointer transition-colors text-xs"
                        >
                          <span className="font-medium text-foreground truncate max-w-[180px]">
                            {obj.name}
                          </span>
                          <StatusBadge status={obj.status} className="text-[10px] py-0 px-1.5" />
                        </div>
                      ))}
                    </div>
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

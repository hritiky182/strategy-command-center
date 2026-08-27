import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useDb } from "@/services/store";
import { ZoomIn, ZoomOut, Maximize2, Layers, Target, BarChart2, Rocket, Briefcase, ChevronRight } from "lucide-react";

export const StrategyMapPage: React.FC = () => {
  const navigate = useNavigate();
  const db = useDb();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedPillarId, setSelectedPillarId] = useState<string>("P1");

  const handleZoomIn = () => setZoomLevel((z) => Math.min(1.4, z + 0.1));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.7, z - 0.1));
  const handleResetZoom = () => setZoomLevel(1);

  const selectedPillar = db.pillars.find((p) => p.id === selectedPillarId) ?? db.pillars[0];
  const linkedObjectives = db.objectives.filter((o) => o.pillarId === selectedPillar?.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interactive Strategy Map"
        subtitle="Visual representation cascading from Strategic Pillars → Objectives → KPIs → Initiatives → Projects."
        breadcrumbs={[{ label: "Strategy Management", href: "/strategy" }, { label: "Strategy Map" }]}
        actions={
          <div className="flex items-center gap-1.5 bg-muted/60 border border-border p-1 rounded-md">
            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-7 w-7 text-muted-foreground">
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <span className="text-xs font-mono px-2 font-medium">{Math.round(zoomLevel * 100)}%</span>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-7 w-7 text-muted-foreground">
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleResetZoom} className="h-7 w-7 text-muted-foreground" title="Fit to screen">
              <Maximize2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        }
      />

      {/* Pillar Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
        {db.pillars.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPillarId(p.id)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
              selectedPillarId === p.id
                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            <span className="font-mono text-[10px] opacity-80">{p.code}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* Strategy Flow Map Container */}
      <div
        className="overflow-x-auto border border-border rounded-xl bg-card p-6 shadow-xs transition-transform duration-200"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top left" }}
      >
        <div className="min-w-[1000px] space-y-6">
          {/* Level 1: Selected Pillar Header */}
          {selectedPillar && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-md bg-primary text-primary-foreground font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary">{selectedPillar.code}</span>
                    <h3 className="text-base font-bold text-foreground">{selectedPillar.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedPillar.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block font-medium">Pillar Score</span>
                <span className="text-xl font-bold text-primary">{selectedPillar.performance}%</span>
              </div>
            </div>
          )}

          {/* Cascading Objectives Tree */}
          <div className="space-y-6">
            {linkedObjectives.map((obj) => {
              const kpis = db.kpis.filter((k) => k.objectiveId === obj.id);
              const inis = db.initiatives.filter((i) => i.objectiveId === obj.id);
              const prjs = db.projects.filter((p) => inis.some((ini) => ini.id === p.initiativeId));

              return (
                <div key={obj.id} className="border border-border/80 rounded-lg p-4 bg-muted/20 space-y-4">
                  {/* Objective Node */}
                  <div
                    onClick={() => navigate(`/strategy/objectives/${obj.id}`)}
                    className="flex items-center justify-between p-3 rounded-md bg-card border border-border hover:border-primary/60 cursor-pointer shadow-2xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-primary" />
                      <div>
                        <span className="text-xs font-mono text-muted-foreground mr-2 font-bold">{obj.code}</span>
                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {obj.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={obj.status} />
                      <span className="text-xs font-bold font-mono">{obj.performance}%</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Flow Breakdown Columns */}
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    {/* KPIs Column */}
                    <div className="space-y-2">
                      <div className="flex items-center text-xs font-bold text-muted-foreground uppercase gap-1.5 px-1">
                        <BarChart2 className="w-3.5 h-3.5" /> KPIs ({kpis.length})
                      </div>
                      <div className="space-y-1.5">
                        {kpis.map((k) => (
                          <div
                            key={k.id}
                            onClick={() => navigate(`/performance/kpis/${k.id}`)}
                            className="p-2.5 rounded-md bg-card border border-border hover:border-emerald-500/50 cursor-pointer text-xs space-y-1 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground truncate">{k.name}</span>
                              <StatusBadge status={k.status} className="text-[9px] py-0 px-1" />
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>Target: {k.target} {k.unit}</span>
                              <span className="font-bold text-foreground">Actual: {k.actual}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Initiatives Column */}
                    <div className="space-y-2">
                      <div className="flex items-center text-xs font-bold text-muted-foreground uppercase gap-1.5 px-1">
                        <Rocket className="w-3.5 h-3.5" /> Strategic Initiatives ({inis.length})
                      </div>
                      <div className="space-y-1.5">
                        {inis.map((ini) => (
                          <div
                            key={ini.id}
                            onClick={() => navigate(`/strategy/initiatives/${ini.id}`)}
                            className="p-2.5 rounded-md bg-card border border-border hover:border-blue-500/50 cursor-pointer text-xs space-y-1 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground truncate">{ini.name}</span>
                              <StatusBadge status={ini.status} className="text-[9px] py-0 px-1" />
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>Progress: {ini.progress}%</span>
                              <span className="font-mono">${(ini.budget / 1_000_000).toFixed(1)}M</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projects Column */}
                    <div className="space-y-2">
                      <div className="flex items-center text-xs font-bold text-muted-foreground uppercase gap-1.5 px-1">
                        <Briefcase className="w-3.5 h-3.5" /> Execution Projects ({prjs.length})
                      </div>
                      <div className="space-y-1.5">
                        {prjs.map((prj) => (
                          <div
                            key={prj.id}
                            onClick={() => navigate(`/projects/${prj.id}`)}
                            className="p-2.5 rounded-md bg-card border border-border hover:border-purple-500/50 cursor-pointer text-xs space-y-1 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground truncate">{prj.name}</span>
                              <StatusBadge status={prj.health} className="text-[9px] py-0 px-1" />
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>Health: {prj.health.toUpperCase()}</span>
                              <span className="font-semibold text-foreground">{prj.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Target, BarChart2, Rocket, Briefcase, AlertTriangle, User, ArrowRight } from "lucide-react";
import { useDb } from "@/services/store";

interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const db = useDb();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  const q = query.trim().toLowerCase();

  const results = React.useMemo(() => {
    if (!q) return { objectives: [], kpis: [], initiatives: [], projects: [], risks: [], users: [] };

    return {
      objectives: db.objectives.filter(
        (o) => o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q)
      ).slice(0, 3),
      kpis: db.kpis.filter(
        (k) => k.name.toLowerCase().includes(q) || k.code.toLowerCase().includes(q)
      ).slice(0, 3),
      initiatives: db.initiatives.filter(
        (i) => i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q)
      ).slice(0, 3),
      projects: db.projects.filter(
        (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
      ).slice(0, 3),
      risks: db.risks.filter(
        (r) => r.title.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)
      ).slice(0, 3),
      users: db.users.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      ).slice(0, 3),
    };
  }, [q, db]);

  const totalResults =
    results.objectives.length +
    results.kpis.length +
    results.initiatives.length +
    results.projects.length +
    results.risks.length +
    results.users.length;

  const handleSelect = (url: string) => {
    onOpenChange(false);
    setQuery("");
    navigate(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden border-border">
        <DialogHeader className="p-4 border-b border-border bg-muted/30">
          <DialogTitle className="sr-only">Global Search</DialogTitle>
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search strategy objectives, KPIs, initiatives, projects, risks..."
              className="pl-9 border-none bg-transparent focus-visible:ring-0 text-base h-10"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground border">
              ESC
            </kbd>
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Type a title, code, or keyword to search across the entire Strategy Command Center.
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No results found for &ldquo;<span className="text-foreground font-medium">{query}</span>&rdquo;
            </div>
          )}

          {results.objectives.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-xs font-semibold uppercase text-muted-foreground gap-1.5 px-2">
                <Target className="w-3.5 h-3.5" /> Strategic Objectives
              </div>
              <div className="space-y-1">
                {results.objectives.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => handleSelect(`/strategy/objectives/${o.id}`)}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-md hover:bg-accent transition-colors group"
                  >
                    <div>
                      <span className="text-xs font-mono text-muted-foreground mr-2">{o.code}</span>
                      <span className="text-sm font-medium text-foreground">{o.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.kpis.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-xs font-semibold uppercase text-muted-foreground gap-1.5 px-2">
                <BarChart2 className="w-3.5 h-3.5" /> Key Performance Indicators
              </div>
              <div className="space-y-1">
                {results.kpis.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => handleSelect(`/performance/kpis/${k.id}`)}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-md hover:bg-accent transition-colors group"
                  >
                    <div>
                      <span className="text-xs font-mono text-muted-foreground mr-2">{k.code}</span>
                      <span className="text-sm font-medium text-foreground">{k.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.initiatives.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-xs font-semibold uppercase text-muted-foreground gap-1.5 px-2">
                <Rocket className="w-3.5 h-3.5" /> Strategic Initiatives
              </div>
              <div className="space-y-1">
                {results.initiatives.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => handleSelect(`/strategy/initiatives/${i.id}`)}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-md hover:bg-accent transition-colors group"
                  >
                    <div>
                      <span className="text-xs font-mono text-muted-foreground mr-2">{i.code}</span>
                      <span className="text-sm font-medium text-foreground">{i.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.projects.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-xs font-semibold uppercase text-muted-foreground gap-1.5 px-2">
                <Briefcase className="w-3.5 h-3.5" /> Projects
              </div>
              <div className="space-y-1">
                {results.projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(`/projects/${p.id}`)}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-md hover:bg-accent transition-colors group"
                  >
                    <div>
                      <span className="text-xs font-mono text-muted-foreground mr-2">{p.code}</span>
                      <span className="text-sm font-medium text-foreground">{p.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.risks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-xs font-semibold uppercase text-muted-foreground gap-1.5 px-2">
                <AlertTriangle className="w-3.5 h-3.5" /> Risks & Issues
              </div>
              <div className="space-y-1">
                {results.risks.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect(`/risks`)}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-md hover:bg-accent transition-colors group"
                  >
                    <div>
                      <span className="text-xs font-mono text-muted-foreground mr-2">{r.code}</span>
                      <span className="text-sm font-medium text-foreground">{r.title}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.users.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-xs font-semibold uppercase text-muted-foreground gap-1.5 px-2">
                <User className="w-3.5 h-3.5" /> People & Users
              </div>
              <div className="space-y-1">
                {results.users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelect(`/admin/users`)}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-md hover:bg-accent transition-colors group"
                  >
                    <div>
                      <span className="text-sm font-medium text-foreground">{u.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({u.role} - {u.department})</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

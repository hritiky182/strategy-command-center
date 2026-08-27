import React from "react";
import { Badge } from "@/components/ui/badge";
import type { Status, Health, ApprovalStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: Status | Health | ApprovalStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "on-track":
    case "green":
    case "approved":
    case "completed":
    case "resolved":
    case "champion":
    case "active":
      return (
        <Badge className={`bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25 font-medium ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
          {label(status)}
        </Badge>
      );

    case "at-risk":
    case "amber":
    case "under-review":
    case "in-progress":
    case "mitigating":
    case "supportive":
    case "medium":
      return (
        <Badge className={`bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25 font-medium ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 inline-block animate-pulse" />
          {label(status)}
        </Badge>
      );

    case "off-track":
    case "red":
    case "critical":
    case "escalated":
    case "rejected":
    case "overdue":
    case "resistant":
    case "high":
    case "suspended":
      return (
        <Badge className={`bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/25 font-medium ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 inline-block" />
          {label(status)}
        </Badge>
      );

    case "planned":
    case "submitted":
    case "open":
    case "neutral":
    case "info":
    case "blue":
      return (
        <Badge className={`bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/25 font-medium ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 inline-block" />
          {label(status)}
        </Badge>
      );

    default:
      return (
        <Badge variant="outline" className={`text-muted-foreground border-border font-medium ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 mr-1.5 inline-block" />
          {label(status)}
        </Badge>
      );
  }
};

function label(s: string): string {
  if (s === "on-track") return "On Track";
  if (s === "at-risk") return "At Risk";
  if (s === "off-track") return "Off Track";
  if (s === "not-reported") return "Not Reported";
  if (s === "under-review") return "Under Review";
  if (s === "in-progress") return "In Progress";
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number; // e.g. +4.2%
  changeLabel?: string;
  status?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  trendData?: number[];
  progress?: number;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeLabel = "vs last period",
  status,
  icon,
  onClick,
  progress,
}) => {
  return (
    <Card
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-200 ${
        onClick ? "cursor-pointer hover:border-primary/50 hover:shadow-md" : ""
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
              {status && <StatusBadge status={status} className="text-xs py-0.5 px-2" />}
            </div>
          </div>
          {icon && (
            <div className="p-2.5 rounded-lg bg-secondary/80 text-secondary-foreground border border-border/50">
              {icon}
            </div>
          )}
        </div>

        {typeof progress === "number" && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  progress >= 90
                    ? "bg-emerald-500"
                    : progress >= 60
                      ? "bg-amber-500"
                      : "bg-rose-500"
                }`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>
        )}

        {(change !== undefined || subtitle) && (
          <div className="mt-3 flex items-center justify-between text-xs border-t border-border/40 pt-2.5">
            {change !== undefined ? (
              <div className="flex items-center gap-1">
                {change > 0 ? (
                  <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />+{change}%
                  </span>
                ) : change < 0 ? (
                  <span className="flex items-center text-rose-600 dark:text-rose-400 font-semibold">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" />{change}%
                  </span>
                ) : (
                  <span className="flex items-center text-muted-foreground font-semibold">
                    <Minus className="w-3.5 h-3.5 mr-0.5" />0%
                  </span>
                )}
                <span className="text-muted-foreground ml-1">{changeLabel}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

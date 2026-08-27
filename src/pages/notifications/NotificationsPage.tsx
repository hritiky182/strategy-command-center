import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useDb, notificationService } from "@/services/store";
import { Bell, CheckCircle2, ArrowRight } from "lucide-react";

export const NotificationsPage: React.FC = () => {
  const db = useDb();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Governance Alerts"
        subtitle="System notifications, critical SLA alerts, approval requests, and milestone tracking."
        breadcrumbs={[{ label: "Notifications" }]}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => notificationService.markAllRead()}
            className="h-9 text-xs gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark All as Read
          </Button>
        }
      />

      <div className="space-y-3">
        {db.notifications.map((n) => (
          <Card
            key={n.id}
            onClick={() => {
              notificationService.markRead(n.id);
              if (n.link) navigate(n.link);
            }}
            className={`cursor-pointer transition-all ${
              !n.read ? "bg-accent/30 border-primary/40 shadow-xs" : "opacity-80"
            }`}
          >
            <CardContent className="p-4 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">{n.title}</span>
                  <StatusBadge status={n.severity} className="text-[10px] py-0 px-1.5" />
                  {!n.read && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                </div>
                <p className="text-muted-foreground">{n.message}</p>
                <span className="text-[10px] text-muted-foreground font-mono block pt-1">
                  Received: {n.createdAt.replace("T", " ")}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 self-center" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

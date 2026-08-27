import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  BarChart3,
  Briefcase,
  AlertTriangle,
  Users,
  DollarSign,
  FileText,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  ShieldCheck,
  GitBranch,
  Layers,
  ListTodo,
  PieChart,
  Network,
  ClipboardList,
  Sliders,
  UserCheck,
  Building2,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDb } from "@/services/store";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  badge?: number | string;
  children?: { label: string; href: string; badge?: number | string }[];
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const location = useLocation();
  const db = useDb();
  const unreadNotifications = db.notifications.filter((n) => !n.read).length;
  const pendingApprovals = db.approvals.filter((a) => a.status === "submitted" || a.status === "under-review").length;

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: "Strategy Management",
      icon: <Target className="w-4 h-4" />,
      children: [
        { label: "Strategy Overview", href: "/strategy" },
        { label: "Strategic Objectives", href: "/strategy/objectives" },
        { label: "Strategic Initiatives", href: "/strategy/initiatives" },
        { label: "Strategy Map", href: "/strategy/map" },
      ],
    },
    {
      label: "Performance",
      icon: <BarChart3 className="w-4 h-4" />,
      children: [
        { label: "KPI Dashboard", href: "/performance" },
        { label: "KPI Repository", href: "/performance/kpis" },
        { label: "KPI Scorecard", href: "/performance/scorecards" },
        { label: "Performance Cascading", href: "/performance/cascading" },
        { label: "Corrective Action Plans", href: "/performance/corrective-actions" },
      ],
    },
    {
      label: "Projects & Portfolios",
      icon: <Briefcase className="w-4 h-4" />,
      children: [
        { label: "Portfolios", href: "/portfolios" },
        { label: "Projects", href: "/projects" },
        { label: "Project Plan (Gantt)", href: "/projects/plan" },
        { label: "Tasks", href: "/projects/tasks" },
        { label: "Milestones & Deliverables", href: "/projects/milestones" },
        { label: "Resource Allocation", href: "/projects/resources" },
      ],
    },
    {
      label: "Risks & Issues",
      href: "/risks",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      label: "Stakeholders",
      href: "/stakeholders",
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: "Financial Management",
      href: "/financials",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      label: "Workflows & Approvals",
      href: "/workflows",
      icon: <ShieldCheck className="w-4 h-4" />,
      ...(pendingApprovals > 0 ? { badge: pendingApprovals } : {}),
    },
    {
      label: "Reports",
      href: "/reports",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: <Bell className="w-4 h-4" />,
      ...(unreadNotifications > 0 ? { badge: unreadNotifications } : {}),
    },
    {
      label: "Administration",
      icon: <Settings className="w-4 h-4" />,
      children: [
        { label: "Users & Access", href: "/admin/users" },
        { label: "Roles & Permissions", href: "/admin/roles" },
        { label: "Organizational Hierarchy", href: "/admin/organization" },
        { label: "System Configuration", href: "/admin/configuration" },
      ],
    },
  ];

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Strategy Management": location.pathname.startsWith("/strategy"),
    Performance: location.pathname.startsWith("/performance"),
    "Projects & Portfolios":
      location.pathname.startsWith("/projects") || location.pathname.startsWith("/portfolios"),
    Administration: location.pathname.startsWith("/admin"),
  });

  const toggleGroup = (groupLabel: string) => {
    if (collapsed) onToggleCollapse(); // Expand if collapsed
    setExpandedGroups((prev) => ({ ...prev, [groupLabel]: !prev[groupLabel] }));
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-3.5 border-b border-sidebar-border shrink-0">
        <Link to="/" onClick={onCloseMobile} className="flex items-center gap-2.5 overflow-hidden">
          <div className="p-1.5 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="leading-none">
              <span className="font-bold tracking-tight text-sm text-foreground">Strategy</span>
              <span className="text-xs font-semibold text-primary block text-emerald-600 dark:text-emerald-400">
                Command Center
              </span>
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="hidden md:flex h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <TooltipProvider delayDuration={300}>
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isGroupExpanded = expandedGroups[item.label];
            const isGroupActive =
              hasChildren && item.children?.some((child) => isActive(child.href));

            if (!hasChildren) {
              const linkNode = (
                <Link
                  to={item.href || "#"}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!collapsed && item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );

              return collapsed ? (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>{linkNode}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <React.Fragment key={item.label}>{linkNode}</React.Fragment>
              );
            }

            // Group item
            const groupNode = (
              <div>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isGroupActive
                      ? "text-primary font-semibold"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!collapsed && (
                    <span className="text-muted-foreground">
                      {isGroupExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </span>
                  )}
                </button>

                {!collapsed && isGroupExpanded && item.children && (
                  <div className="ml-4 pl-2.5 border-l border-sidebar-border mt-1 space-y-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        onClick={onCloseMobile}
                        className={`block px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                          isActive(child.href)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold text-primary"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );

            return collapsed ? (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>{groupNode}</TooltipTrigger>
                <TooltipContent side="right" className="text-xs font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ) : (
              <React.Fragment key={item.label}>{groupNode}</React.Fragment>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Footer System Info */}
      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border text-[11px] text-muted-foreground space-y-1">
          <div className="flex justify-between font-medium">
            <span>Enterprise Suite</span>
            <span className="font-mono text-[10px]">v3.4.0</span>
          </div>
          <p className="text-[10px] text-muted-foreground/80">Strategy & Portfolio Governance</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 z-30 h-screen transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  User as UserIcon,
  Shield,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDb, notificationService, resetDb } from "@/services/store";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import type { RoleName } from "@/lib/types";

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenGlobalSearch: () => void;
  activeRole: RoleName;
  onRoleChange: (role: RoleName) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onOpenGlobalSearch,
  activeRole,
  onRoleChange,
}) => {
  const db = useDb();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const unreadCount = db.notifications.filter((n) => !n.read).length;
  const [darkTheme, setDarkTheme] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const toggleDark = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setDarkTheme(isDark);
    toast.info(`Theme changed to ${isDark ? "Dark" : "Light"} mode`);
  };

  const handleResetData = () => {
    resetDb();
    toast.success("Mock database reset to initial baseline.");
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out of Strategy Command Center.");
    navigate("/login", { replace: true });
  };

  const roles: RoleName[] = [
    "Admin",
    "Executive",
    "Strategy Manager",
    "Performance Manager",
    "Project Manager",
    "Department Manager",
    "Viewer",
  ];

  const userName = user?.name ?? "Dr. Amina Al Farsi";
  const userEmail = user?.email ?? "amina.farsi@gov.example";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur-xs px-4 sm:px-6">
      {/* Left side: Mobile Toggle & Quick Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileSidebar}
          className="md:hidden h-8 w-8 text-muted-foreground"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Global Search Quick Trigger */}
        <button
          onClick={onOpenGlobalSearch}
          className="flex items-center gap-2 rounded-md border border-input bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-44 sm:w-64"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="truncate">Search system...</span>
          <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 rounded border bg-background px-1.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Notifications, Role Switcher, Help & Profile */}
      <div className="flex items-center gap-2">
        {/* Role Switcher Pill */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-semibold border-primary/30 text-primary bg-primary/10 hover:bg-primary/20"
            >
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">{activeRole}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Simulate Enterprise Role
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roles.map((r) => (
              <DropdownMenuItem
                key={r}
                onClick={() => {
                  onRoleChange(r);
                  toast.success(`Active role updated to ${r}`);
                }}
                className="text-xs flex items-center justify-between"
              >
                <span>{r}</span>
                {activeRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDark}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Toggle Dark/Light Mode"
        >
          {darkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Notification Bell Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0 border-border shadow-lg">
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted/40">
              <span className="text-xs font-semibold text-foreground">Notifications ({db.notifications.length})</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => notificationService.markAllRead()}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
              {db.notifications.slice(0, 6).map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    notificationService.markRead(n.id);
                    if (n.link) navigate(n.link);
                  }}
                  className={`p-3 text-xs cursor-pointer transition-colors ${
                    !n.read ? "bg-accent/40 hover:bg-accent/70" : "hover:bg-accent/30 opacity-80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold text-foreground">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {n.createdAt.slice(11, 16)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px] mt-1 line-clamp-2">{n.message}</p>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-border text-center bg-muted/20">
              <Link
                to="/notifications"
                className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                View all notifications <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-2 pl-2 pr-1">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {initials}
              </div>
              <span className="hidden lg:inline text-xs font-medium text-foreground">{userName}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-bold leading-none text-foreground">{userName}</p>
                <p className="text-[11px] leading-none text-muted-foreground">{userEmail}</p>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  Role: {activeRole}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/admin/users")} className="text-xs">
              <UserIcon className="w-3.5 h-3.5 mr-2" /> User Profile & Access
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleResetData} className="text-xs text-amber-600 dark:text-amber-400">
              <RotateCcw className="w-3.5 h-3.5 mr-2" /> Reset Demo Mock Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
              <LogOut className="w-3.5 h-3.5 mr-2" /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

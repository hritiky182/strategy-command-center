import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Crown,
  Shield,
  Compass,
  LineChart,
  FolderKanban,
  Building2,
  Eye,
  CheckCircle2,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import type { RoleName } from "@/lib/types";

export const LoginPage: React.FC = () => {
  const { login, loginAsRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("admin@gov.example");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      setLoading(false);

      if (success) {
        toast.success("Authenticated successfully. Welcome back.");
        navigate(from, { replace: true });
      } else {
        toast.error("Invalid credentials. Please select a demo role persona below.");
      }
    }, 500);
  };

  const handleQuickDemoLogin = (role: RoleName) => {
    loginAsRole(role);
    toast.success(`Authenticated as ${role}`);
    navigate(from, { replace: true });
  };

  const roles: {
    role: RoleName;
    label: string;
    badge: string;
    icon: React.ElementType;
  }[] = [
    {
      role: "Executive",
      label: "Executive Leadership",
      badge: "Full Oversight",
      icon: Crown,
    },
    {
      role: "Admin",
      label: "System Administrator",
      badge: "Full RBAC Control",
      icon: Shield,
    },
    {
      role: "Strategy Manager",
      label: "Strategy & Vision",
      badge: "Pillars & Goals",
      icon: Compass,
    },
    {
      role: "Performance Manager",
      label: "Performance Lead",
      badge: "KPI Scorecards",
      icon: LineChart,
    },
    {
      role: "Project Manager",
      label: "PPM & Execution",
      badge: "Gantt & Tasks",
      icon: FolderKanban,
    },
    {
      role: "Department Manager",
      label: "Sector Operations",
      badge: "Entity Delivery",
      icon: Building2,
    },
    {
      role: "Viewer",
      label: "Executive Viewer",
      badge: "Read-Only Access",
      icon: Eye,
    },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Ambient Decorative Background Shapes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-muted/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card using Native System Tokens */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden relative z-10 my-auto">
        
        {/* Left Side: Enterprise Branding & Key Pillars */}
        <div className="lg:col-span-5 p-8 sm:p-10 bg-muted/30 border-r border-border flex flex-col justify-between relative">
          <div className="space-y-8 relative z-10">
            {/* Header Brand */}
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-primary text-primary-foreground shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="font-extrabold text-xl tracking-tight text-foreground flex items-center gap-2">
                  Strategy Command <span className="text-primary">Center</span>
                </h1>
                <p className="text-xs text-muted-foreground font-medium tracking-wide">
                  Enterprise Strategy, Performance & Governance
                </p>
              </div>
            </div>

            {/* Platform Highlights */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Platform Architecture
              </h2>

              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-start gap-3 bg-background p-3 rounded-lg border border-border">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">National Strategy Cascading</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Cascade strategic pillars down to objectives, KPIs, initiatives & entity projects.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-background p-3 rounded-lg border border-border">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">PPM & Financial Controls</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Real-time portfolio management, milestone tracking, and budget compliance.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-background p-3 rounded-lg border border-border">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Multi-Role Governance RBAC</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">7 granular persona roles tailored for executive oversight and execution.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Badge */}
          <div className="pt-8 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-primary" /> Government-Grade
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
              ISO 27001 Certified
            </span>
          </div>
        </div>

        {/* Right Side: Sign In & Quick Role Selector */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-8 bg-card">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Sign In to Dashboard</h2>
            <p className="text-xs text-muted-foreground">
              Access your enterprise command center with your account or a 1-click persona demo.
            </p>
          </div>

          {/* Login Form using standard Button & Input components */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gov.example"
                  className="pl-10 h-10 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Password</label>
                <button type="button" className="text-[11px] text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-10 text-xs"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 text-xs font-bold gap-2 mt-2"
            >
              {loading ? "Authenticating Account..." : "Sign In to Command Center"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Demo Role Persona Selector */}
          <div className="pt-6 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wide uppercase text-muted-foreground">
                1-Click Quick Demo Login
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                Select Persona
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {roles.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleQuickDemoLogin(item.role)}
                    className="p-3 rounded-xl border border-border bg-muted/20 text-left transition-all hover:bg-accent hover:border-primary/40 group hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                          {item.role}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground group-hover:text-foreground">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 font-medium group-hover:text-foreground/80">
                      {item.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

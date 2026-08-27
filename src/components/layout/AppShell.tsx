import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { GlobalSearchModal } from "@/components/common/GlobalSearchModal";
import { Toaster } from "sonner";
import { useAuth } from "@/context/AuthContext";
import type { RoleName } from "@/lib/types";

export const AppShell: React.FC = () => {
  const { user, switchRole } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<RoleName>(user?.role ?? "Executive");

  useEffect(() => {
    if (user?.role) {
      setActiveRole(user.role);
    }
  }, [user?.role]);

  const handleRoleChange = (role: RoleName) => {
    setActiveRole(role);
    switchRole(role);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Top Header */}
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenGlobalSearch={() => setSearchModalOpen(true)}
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
        />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ activeRole }} />
        </main>
      </div>

      {/* Global Search Dialog */}
      <GlobalSearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
};

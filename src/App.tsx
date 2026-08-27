import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { AppShell } from "@/components/layout/AppShell";

// Page Imports
import { DashboardPage } from "@/pages/DashboardPage";
import { StrategyOverviewPage } from "@/pages/strategy/StrategyOverviewPage";
import { ObjectivesPage } from "@/pages/strategy/ObjectivesPage";
import { ObjectiveDetailPage } from "@/pages/strategy/ObjectiveDetailPage";
import { InitiativesPage } from "@/pages/strategy/InitiativesPage";
import { InitiativeDetailPage } from "@/pages/strategy/InitiativeDetailPage";
import { StrategyMapPage } from "@/pages/strategy/StrategyMapPage";

import { KpiDashboardPage } from "@/pages/performance/KpiDashboardPage";
import { KpiRepositoryPage } from "@/pages/performance/KpiRepositoryPage";
import { KpiDetailPage } from "@/pages/performance/KpiDetailPage";
import { KpiScorecardPage } from "@/pages/performance/KpiScorecardPage";
import { PerformanceCascadingPage } from "@/pages/performance/PerformanceCascadingPage";
import { CorrectiveActionsPage } from "@/pages/performance/CorrectiveActionsPage";

import { PortfoliosPage } from "@/pages/ppm/PortfoliosPage";
import { ProjectsPage } from "@/pages/ppm/ProjectsPage";
import { ProjectDetailPage } from "@/pages/ppm/ProjectDetailPage";
import { GanttPlanPage } from "@/pages/ppm/GanttPlanPage";
import { TasksPage } from "@/pages/ppm/TasksPage";
import { MilestonesPage } from "@/pages/ppm/MilestonesPage";
import { ResourcesPage } from "@/pages/ppm/ResourcesPage";

import { RisksIssuesPage } from "@/pages/governance/RisksIssuesPage";
import { StakeholdersPage } from "@/pages/stakeholders/StakeholdersPage";
import { FinancialsPage } from "@/pages/financials/FinancialsPage";
import { WorkflowsPage } from "@/pages/workflows/WorkflowsPage";
import { ReportsPage } from "@/pages/reports/ReportsPage";
import { NotificationsPage } from "@/pages/notifications/NotificationsPage";

import { UsersPage } from "@/pages/admin/UsersPage";
import { RolesPage } from "@/pages/admin/RolesPage";
import { OrganizationPage } from "@/pages/admin/OrganizationPage";
import { ConfigurationPage } from "@/pages/admin/ConfigurationPage";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Application Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            {/* Executive Dashboard */}
            <Route path="/" element={<DashboardPage />} />

            {/* Strategy Management */}
            <Route path="/strategy" element={<StrategyOverviewPage />} />
            <Route path="/strategy/objectives" element={<ObjectivesPage />} />
            <Route path="/strategy/objectives/:id" element={<ObjectiveDetailPage />} />
            <Route path="/strategy/initiatives" element={<InitiativesPage />} />
            <Route path="/strategy/initiatives/:id" element={<InitiativeDetailPage />} />
            <Route path="/strategy/map" element={<StrategyMapPage />} />

            {/* Performance Management */}
            <Route path="/performance" element={<KpiDashboardPage />} />
            <Route path="/performance/kpis" element={<KpiRepositoryPage />} />
            <Route path="/performance/kpis/:id" element={<KpiDetailPage />} />
            <Route path="/performance/scorecards" element={<KpiScorecardPage />} />
            <Route path="/performance/cascading" element={<PerformanceCascadingPage />} />
            <Route path="/performance/corrective-actions" element={<CorrectiveActionsPage />} />

            {/* Project & Portfolio Management */}
            <Route path="/portfolios" element={<PortfoliosPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/projects/plan" element={<GanttPlanPage />} />
            <Route path="/projects/tasks" element={<TasksPage />} />
            <Route path="/projects/milestones" element={<MilestonesPage />} />
            <Route path="/projects/resources" element={<ResourcesPage />} />

            {/* Governance & Operations */}
            <Route path="/risks" element={<RisksIssuesPage />} />
            <Route path="/stakeholders" element={<StakeholdersPage />} />
            <Route path="/financials" element={<FinancialsPage />} />
            <Route path="/workflows" element={<WorkflowsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />

            {/* Administration */}
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/roles" element={<RolesPage />} />
            <Route path="/admin/organization" element={<OrganizationPage />} />
            <Route path="/admin/configuration" element={<ConfigurationPage />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

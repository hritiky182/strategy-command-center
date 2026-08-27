import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { ExportButton } from "@/components/common/ExportButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDb } from "@/services/store";
import { DollarSign, TrendingUp, PieChart, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export const FinancialsPage: React.FC = () => {
  const db = useDb();

  const totalBudget = db.portfolios.reduce((s, p) => s + p.budget, 0);
  const totalPlannedCost = db.portfolios.reduce((s, p) => s + p.plannedCost, 0);
  const totalActualCost = db.portfolios.reduce((s, p) => s + p.actualCost, 0);
  const totalVariance = totalBudget - totalActualCost;

  const portfolioFinancials = db.portfolios.map((pf) => ({
    name: pf.name.replace(" Portfolio", ""),
    budget: Math.round(pf.budget / 1_000_000),
    planned: Math.round(pf.plannedCost / 1_000_000),
    actual: Math.round(pf.actualCost / 1_000_000),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Management & Governance"
        subtitle="National budget allocation, expenditure tracking, burn rate, and financial variance analysis."
        breadcrumbs={[{ label: "Financial Management" }]}
        actions={<ExportButton filename="financial_governance.csv" data={db.portfolios} />}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Portfolio Budget"
          value={`$${(totalBudget / 1_000_000).toFixed(0)}M`}
          subtitle="FY2026 Approved Baseline"
          icon={<DollarSign className="w-5 h-5 text-primary" />}
        />
        <KpiCard
          title="Planned Expenditure"
          value={`$${(totalPlannedCost / 1_000_000).toFixed(0)}M`}
          subtitle="YTD Budget Baseline"
          icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
        />
        <KpiCard
          title="Actual Expenditure"
          value={`$${(totalActualCost / 1_000_000).toFixed(0)}M`}
          subtitle={`Utilisation Rate: ${Math.round((totalActualCost / totalBudget) * 100)}%`}
          status={totalActualCost <= totalBudget ? "on-track" : "off-track"}
          icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
        />
        <KpiCard
          title="Budget Variance"
          value={`$${(totalVariance / 1_000_000).toFixed(0)}M`}
          subtitle="Remaining Unspent Capital"
          status={totalVariance >= 0 ? "on-track" : "off-track"}
          icon={<AlertTriangle className="w-5 h-5 text-purple-500" />}
        />
      </div>

      {/* Financial Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Portfolio Budget vs Spend Analysis ($ Millions)</CardTitle>
          <CardDescription className="text-xs">Comparative expenditure breakdown by portfolio</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={portfolioFinancials} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="budget" fill="#cbd5e1" name="Approved Budget ($M)" />
              <Bar dataKey="planned" fill="#60a5fa" name="Planned YTD ($M)" />
              <Bar dataKey="actual" fill="var(--color-primary)" name="Actual Spend ($M)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

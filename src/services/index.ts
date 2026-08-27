import { getDb, setDb, nextId } from "./store";
import type {
  ApprovalRequest,
  ApprovalStatus,
  CorrectiveAction,
  Initiative,
  Issue,
  Kpi,
  Notification,
  Objective,
  Project,
  ReportRun,
  Risk,
  Stakeholder,
  User,
} from "@/lib/types";

/* --------------------------------------------------------------------------
 * Mock services. Each function is a synchronous stand-in for a future REST /
 * GraphQL call. Swap the bodies for `fetch(...)` when a backend exists.
 * ----------------------------------------------------------------------- */

export const strategyService = {
  listPillars: () => getDb().pillars,
  listObjectives: () => getDb().objectives,
  getObjective: (id: string) => getDb().objectives.find((o) => o.id === id),
  createObjective: (data: Omit<Objective, "id" | "code" | "history">) => {
    const id = nextId("OBJ", getDb().objectives);
    setDb((d) => ({
      ...d,
      objectives: [
        ...d.objectives,
        {
          ...data,
          id,
          code: id,
          history: [{ date: today(), actor: "You", action: "Objective created" }],
        },
      ],
    }));
    return id;
  },
  updateObjective: (id: string, patch: Partial<Objective>) =>
    setDb((d) => ({
      ...d,
      objectives: d.objectives.map((o) =>
        o.id === id
          ? {
              ...o,
              ...patch,
              history: [{ date: today(), actor: "You", action: "Objective updated" }, ...o.history],
            }
          : o,
      ),
    })),
  deleteObjective: (id: string) =>
    setDb((d) => ({ ...d, objectives: d.objectives.filter((o) => o.id !== id) })),
  strategyPerformance: () => {
    const p = getDb().pillars;
    const total = p.reduce((s, x) => s + x.weight, 0);
    return Math.round((p.reduce((s, x) => s + x.performance * x.weight, 0) / total) * 10) / 10;
  },
};

export const kpiService = {
  list: () => getDb().kpis,
  get: (id: string) => getDb().kpis.find((k) => k.id === id),
  byObjective: (objectiveId: string) => getDb().kpis.filter((k) => k.objectiveId === objectiveId),
  create: (data: Omit<Kpi, "id" | "code" | "trend">) => {
    const id = nextId("KPI", getDb().kpis);
    setDb((d) => ({ ...d, kpis: [...d.kpis, { ...data, id, code: id, trend: [] }] }));
    return id;
  },
  update: (id: string, patch: Partial<Kpi>) =>
    setDb((d) => ({ ...d, kpis: d.kpis.map((k) => (k.id === id ? { ...k, ...patch } : k)) })),
  remove: (id: string) => setDb((d) => ({ ...d, kpis: d.kpis.filter((k) => k.id !== id) })),
  achievement: (k: Kpi) => (k.target === 0 ? 0 : Math.round((k.actual / k.target) * 1000) / 10),
  listCorrectiveActions: () => getDb().correctiveActions,
  updateCorrectiveAction: (id: string, patch: Partial<CorrectiveAction>) =>
    setDb((d) => ({
      ...d,
      correctiveActions: d.correctiveActions.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),
};

export const initiativeService = {
  list: () => getDb().initiatives,
  get: (id: string) => getDb().initiatives.find((i) => i.id === id),
  byObjective: (objectiveId: string) =>
    getDb().initiatives.filter((i) => i.objectiveId === objectiveId),
  update: (id: string, patch: Partial<Initiative>) =>
    setDb((d) => ({
      ...d,
      initiatives: d.initiatives.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    })),
  create: (data: Omit<Initiative, "id" | "code" | "activities" | "history">) => {
    const id = nextId("INI", getDb().initiatives);
    setDb((d) => ({
      ...d,
      initiatives: [
        ...d.initiatives,
        {
          ...data,
          id,
          code: id,
          activities: [],
          history: [{ date: today(), actor: "You", action: "Initiative created" }],
        },
      ],
    }));
    return id;
  },
  remove: (id: string) =>
    setDb((d) => ({ ...d, initiatives: d.initiatives.filter((i) => i.id !== id) })),
};

export const portfolioService = {
  list: () => getDb().portfolios,
  get: (id: string) => getDb().portfolios.find((p) => p.id === id),
};

export const projectService = {
  list: () => getDb().projects,
  get: (id: string) => getDb().projects.find((p) => p.id === id),
  byPortfolio: (portfolioId: string) =>
    getDb().projects.filter((p) => p.portfolioId === portfolioId),
  byInitiative: (initiativeId: string) =>
    getDb().projects.filter((p) => p.initiativeId === initiativeId),
  update: (id: string, patch: Partial<Project>) =>
    setDb((d) => ({ ...d, projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
  remove: (id: string) => setDb((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) })),
  allMilestones: () => getDb().projects.flatMap((p) => p.milestones.map((m) => ({ ...m, project: p }))),
  allResources: () =>
    getDb().projects.flatMap((p) => p.resources.map((r) => ({ ...r, project: p }))),
};

export const riskService = {
  list: () => getDb().risks,
  score: (r: Risk) => r.probability * r.impact,
  create: (data: Omit<Risk, "id" | "code">) => {
    const id = nextId("RSK", getDb().risks);
    setDb((d) => ({ ...d, risks: [...d.risks, { ...data, id, code: id }] }));
    return id;
  },
  update: (id: string, patch: Partial<Risk>) =>
    setDb((d) => ({ ...d, risks: d.risks.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
  remove: (id: string) => setDb((d) => ({ ...d, risks: d.risks.filter((r) => r.id !== id) })),
  listIssues: () => getDb().issues,
  updateIssue: (id: string, patch: Partial<Issue>) =>
    setDb((d) => ({ ...d, issues: d.issues.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
  createIssue: (data: Omit<Issue, "id" | "code">) => {
    const id = nextId("ISS", getDb().issues);
    setDb((d) => ({ ...d, issues: [...d.issues, { ...data, id, code: id }] }));
    return id;
  },
  removeIssue: (id: string) =>
    setDb((d) => ({ ...d, issues: d.issues.filter((i) => i.id !== id) })),
};

export const stakeholderService = {
  list: () => getDb().stakeholders,
  create: (data: Omit<Stakeholder, "id">) => {
    const id = nextId("STK", getDb().stakeholders);
    setDb((d) => ({ ...d, stakeholders: [...d.stakeholders, { ...data, id }] }));
    return id;
  },
  update: (id: string, patch: Partial<Stakeholder>) =>
    setDb((d) => ({
      ...d,
      stakeholders: d.stakeholders.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    })),
  remove: (id: string) =>
    setDb((d) => ({ ...d, stakeholders: d.stakeholders.filter((s) => s.id !== id) })),
};

export const workflowService = {
  list: () => getDb().approvals,
  transition: (id: string, status: ApprovalStatus, note: string) =>
    setDb((d) => ({
      ...d,
      approvals: d.approvals.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              history: [{ date: today(), actor: "You", action: `${labelOf(status)} — ${note}` }, ...a.history],
            }
          : a,
      ),
    })),
  create: (data: Omit<ApprovalRequest, "id" | "code" | "history">) => {
    const id = nextId("APR", getDb().approvals);
    setDb((d) => ({
      ...d,
      approvals: [
        { ...data, id, code: id, history: [{ date: today(), actor: "You", action: "Request created" }] },
        ...d.approvals,
      ],
    }));
    return id;
  },
};

export const notificationService = {
  list: () => getDb().notifications,
  unreadCount: () => getDb().notifications.filter((n) => !n.read).length,
  markRead: (id: string, read = true) =>
    setDb((d) => ({
      ...d,
      notifications: d.notifications.map((n) => (n.id === id ? { ...n, read } : n)),
    })),
  markAllRead: () =>
    setDb((d) => ({ ...d, notifications: d.notifications.map((n) => ({ ...n, read: true })) })),
  remove: (id: string) =>
    setDb((d) => ({ ...d, notifications: d.notifications.filter((n) => n.id !== id) })),
  push: (n: Omit<Notification, "id" | "createdAt" | "read">) =>
    setDb((d) => ({
      ...d,
      notifications: [
        { ...n, id: nextId("NTF", d.notifications), createdAt: new Date().toISOString(), read: false },
        ...d.notifications,
      ],
    })),
};

export const userService = {
  list: () => getDb().users,
  create: (data: Omit<User, "id" | "lastLogin">) => {
    const id = nextId("USR", getDb().users);
    setDb((d) => ({ ...d, users: [...d.users, { ...data, id, lastLogin: "—" }] }));
    return id;
  },
  update: (id: string, patch: Partial<User>) =>
    setDb((d) => ({ ...d, users: d.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) })),
  remove: (id: string) => setDb((d) => ({ ...d, users: d.users.filter((u) => u.id !== id) })),
  org: () => getDb().orgNodes,
};

export const reportService = {
  history: () => getDb().reportHistory,
  generate: (run: Omit<ReportRun, "id" | "generatedAt" | "size" | "by">) => {
    const id = nextId("RPT", getDb().reportHistory);
    setDb((d) => ({
      ...d,
      reportHistory: [
        {
          ...run,
          id,
          generatedAt: today(),
          size: `${(1 + (d.reportHistory.length % 8)).toFixed(1)} MB`,
          by: "You",
        },
        ...d.reportHistory,
      ],
    }));
    return id;
  },
};

function labelOf(status: ApprovalStatus) {
  return {
    draft: "Returned to draft",
    submitted: "Submitted",
    "under-review": "Moved to review",
    approved: "Approved",
    rejected: "Rejected",
  }[status];
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

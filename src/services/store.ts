import { useSyncExternalStore } from "react";
import * as seed from "@/lib/mock-data";
import type {
  ApprovalRequest,
  CorrectiveAction,
  Initiative,
  Issue,
  Kpi,
  Notification,
  Objective,
  OrgNode,
  Pillar,
  Portfolio,
  Project,
  ReportRun,
  Risk,
  Stakeholder,
  User,
} from "@/lib/types";

export interface Database {
  pillars: Pillar[];
  objectives: Objective[];
  kpis: Kpi[];
  initiatives: Initiative[];
  portfolios: Portfolio[];
  projects: Project[];
  risks: Risk[];
  issues: Issue[];
  stakeholders: Stakeholder[];
  correctiveActions: CorrectiveAction[];
  approvals: ApprovalRequest[];
  notifications: Notification[];
  users: User[];
  orgNodes: OrgNode[];
  reportHistory: ReportRun[];
}

const STORAGE_KEY = "gpms.db.v1";

function seedDb(): Database {
  return {
    pillars: seed.pillars,
    objectives: seed.objectives,
    kpis: seed.kpis,
    initiatives: seed.initiatives,
    portfolios: seed.portfolios,
    projects: seed.projects,
    risks: seed.risks,
    issues: seed.issues,
    stakeholders: seed.stakeholders,
    correctiveActions: seed.correctiveActions,
    approvals: seed.approvals,
    notifications: seed.notifications,
    users: seed.users,
    orgNodes: seed.orgNodes,
    reportHistory: seed.reportHistory,
  };
}

let db: Database = seedDb();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function getDb() {
  return db;
}

export function setDb(updater: (current: Database) => Database) {
  db = updater(db);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      /* storage unavailable */
    }
  }
  emit();
}

export function hydrate() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<Database>;
    db = { ...seedDb(), ...parsed };
    emit();
  } catch {
    /* ignore corrupt storage */
  }
}

export function resetDb() {
  db = seedDb();
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDb(): Database {
  return useSyncExternalStore(
    subscribe,
    () => db,
    () => db,
  );
}

export function nextId(prefix: string, existing: { id: string }[]) {
  const n = existing.length + 1;
  return `${prefix}-${String(n).padStart(3, "0")}`;
}

export * from "./index";

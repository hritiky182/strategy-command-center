export type Status =
  | "on-track"
  | "at-risk"
  | "off-track"
  | "not-reported"
  | "completed"
  | "planned"
  | "on-hold"
  | "cancelled";

export type Health = "green" | "amber" | "red";

export type ApprovalStatus = "draft" | "submitted" | "under-review" | "approved" | "rejected";

export interface Pillar {
  id: string;
  code: string;
  name: string;
  description: string;
  weight: number;
  performance: number;
  color: string;
}

export interface Objective {
  id: string;
  code: string;
  name: string;
  description: string;
  pillarId: string;
  owner: string;
  department: string;
  weight: number;
  performance: number;
  status: Status;
  startDate: string;
  endDate: string;
  history: HistoryEntry[];
}

export interface HistoryEntry {
  date: string;
  actor: string;
  action: string;
}

export type KpiType = "leading" | "lagging";
export type KpiFrequency = "monthly" | "quarterly" | "semi-annual" | "annual";

export interface Kpi {
  id: string;
  code: string;
  name: string;
  definition: string;
  formula: string;
  type: KpiType;
  objectiveId: string;
  owner: string;
  department: string;
  sector: string;
  dataSource: string;
  frequency: KpiFrequency;
  unit: string;
  baseline: number;
  target: number;
  actual: number;
  weight: number;
  polarity: "increase" | "decrease";
  status: Status;
  trend: { period: string; target: number; actual: number }[];
}

export interface Initiative {
  id: string;
  code: string;
  name: string;
  description: string;
  objectiveId: string;
  owner: string;
  department: string;
  progress: number;
  status: Status;
  startDate: string;
  endDate: string;
  budget: number;
  actualCost: number;
  activities: { id: string; name: string; owner: string; progress: number; due: string }[];
  history: HistoryEntry[];
}

export interface Portfolio {
  id: string;
  code: string;
  name: string;
  manager: string;
  sector: string;
  budget: number;
  actualCost: number;
  plannedCost: number;
  performance: number;
  health: Health;
}

export type ProjectType = "capital" | "digital" | "operational" | "infrastructure" | "policy";

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  type: ProjectType;
  portfolioId: string;
  initiativeId: string;
  manager: string;
  department: string;
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
  plannedCost: number;
  actualCost: number;
  health: Health;
  status: Status;
  phases: Phase[];
  tasks: Task[];
  milestones: Milestone[];
  deliverables: Deliverable[];
  dependencies: { id: string; from: string; to: string; type: string }[];
  resources: ResourceAssignment[];
  documents: { id: string; name: string; type: string; uploaded: string; owner: string }[];
  activity: HistoryEntry[];
}

export interface Phase {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
}

export interface Task {
  id: string;
  name: string;
  phaseId: string;
  owner: string;
  start: string;
  end: string;
  progress: number;
  status: Status;
  dependsOn?: string;
}

export interface Milestone {
  id: string;
  name: string;
  projectId: string;
  date: string;
  status: Status;
  owner: string;
}

export interface Deliverable {
  id: string;
  name: string;
  due: string;
  status: ApprovalStatus;
  owner: string;
}

export interface ResourceAssignment {
  id: string;
  name: string;
  role: string;
  allocation: number;
  rate: number;
  department: string;
}

export interface Risk {
  id: string;
  code: string;
  title: string;
  entity: string;
  entityId: string;
  category: string;
  probability: number;
  impact: number;
  owner: string;
  mitigation: string;
  dueDate: string;
  status: "open" | "mitigating" | "closed" | "escalated";
}

export interface Issue {
  id: string;
  code: string;
  title: string;
  projectId: string;
  priority: "critical" | "high" | "medium" | "low";
  owner: string;
  dueDate: string;
  status: "open" | "in-progress" | "resolved" | "escalated";
  resolution: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  department: string;
  role: string;
  influence: number;
  interest: number;
  engagement: "supportive" | "neutral" | "resistant" | "champion";
  owner: string;
  frequency: string;
}

export interface CorrectiveAction {
  id: string;
  code: string;
  kpiId: string;
  description: string;
  owner: string;
  dueDate: string;
  status: "open" | "in-progress" | "completed" | "overdue";
}

export interface ApprovalRequest {
  id: string;
  code: string;
  title: string;
  type:
    | "project-approval"
    | "deliverable-approval"
    | "change-request"
    | "completion-certificate"
    | "initiative-change"
    | "risk-escalation";
  requester: string;
  submittedAt: string;
  amount?: number;
  status: ApprovalStatus;
  reference: string;
  notes: string;
  history: HistoryEntry[];
}

export interface Notification {
  id: string;
  type: "kpi-alert" | "project-delay" | "risk-escalation" | "approval" | "deadline" | "performance";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  severity: "info" | "warning" | "critical";
  link?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  department: string;
  sector: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
}

export type RoleName =
  | "Admin"
  | "Executive"
  | "Strategy Manager"
  | "Performance Manager"
  | "Project Manager"
  | "Department Manager"
  | "Viewer";

export type Permission = "View" | "Create" | "Edit" | "Delete" | "Approve" | "Export" | "Configure";

export interface OrgNode {
  id: string;
  name: string;
  level: "center" | "sector" | "department";
  parentId?: string;
  head: string;
  headcount: number;
  performance: number;
}

export interface ReportRun {
  id: string;
  name: string;
  category: string;
  generatedAt: string;
  period: string;
  format: "PDF" | "Excel" | "CSV";
  size: string;
  by: string;
}

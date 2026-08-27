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
} from "./types";

// Deterministic pseudo-random so SSR and client render identically.
function rnd(seed: number) {
  const x = Math.sin(seed * 9973.13) * 10000;
  return x - Math.floor(x);
}
const pick = <T,>(arr: T[], seed: number) => arr[Math.floor(rnd(seed) * arr.length)];
const between = (min: number, max: number, seed: number) =>
  Math.round(min + rnd(seed) * (max - min));

export const VISION =
  "A globally competitive, digitally enabled and citizen-centric public sector delivering measurable national impact by 2030.";
export const MISSION =
  "To plan, govern and deliver national programmes through transparent performance management, disciplined portfolio execution and evidence-based decision making.";

export const SECTORS = [
  "Digital Government Sector",
  "Infrastructure & Urban Sector",
  "Economic Development Sector",
  "Human Capital Sector",
  "Corporate Services Sector",
];

export const DEPARTMENTS = [
  "Digital Services",
  "Cybersecurity & Data",
  "Roads & Transport",
  "Urban Planning",
  "Investment & Trade",
  "SME Development",
  "Education Programmes",
  "Public Health Programmes",
  "Finance & Budget",
  "Human Resources",
  "Strategy & Performance",
  "Procurement",
];

export const PEOPLE = [
  "Dr. Amina Al Farsi",
  "Khalid Rahman",
  "Sara Menon",
  "Omar Haddad",
  "Priya Nair",
  "Jonas Berg",
  "Layla Mansour",
  "Daniel Okafor",
  "Hessa Al Mazrouei",
  "Rajesh Iyer",
  "Marta Kowalska",
  "Yusuf Demir",
  "Claire Dubois",
  "Ahmed Siddiqui",
  "Nadia Petrova",
];

export const pillars: Pillar[] = [
  {
    id: "P1",
    code: "SP-01",
    name: "Digital Government Excellence",
    description:
      "Deliver seamless, secure and fully digital public services across every citizen and business journey.",
    weight: 25,
    performance: 87.4,
    color: "var(--chart-1)",
  },
  {
    id: "P2",
    code: "SP-02",
    name: "Sustainable Infrastructure",
    description:
      "Expand resilient transport, utilities and urban infrastructure aligned to long-term growth corridors.",
    weight: 22,
    performance: 74.1,
    color: "var(--chart-2)",
  },
  {
    id: "P3",
    code: "SP-03",
    name: "Economic Diversification",
    description:
      "Grow non-oil GDP contribution through investment attraction, SME enablement and sector clusters.",
    weight: 20,
    performance: 68.9,
    color: "var(--chart-3)",
  },
  {
    id: "P4",
    code: "SP-04",
    name: "Human Capital & Wellbeing",
    description:
      "Raise education, workforce readiness and population health outcomes to global benchmarks.",
    weight: 18,
    performance: 81.2,
    color: "var(--chart-4)",
  },
  {
    id: "P5",
    code: "SP-05",
    name: "Institutional Efficiency",
    description:
      "Improve fiscal discipline, governance maturity and operational productivity across entities.",
    weight: 15,
    performance: 79.6,
    color: "var(--chart-5)",
  },
];

const objectiveSeeds: [string, string, string][] = [
  ["P1", "Achieve 100% digital service availability", "Digital Services"],
  ["P1", "Strengthen national cybersecurity posture", "Cybersecurity & Data"],
  ["P1", "Increase citizen satisfaction with digital channels", "Digital Services"],
  ["P2", "Expand integrated public transport network", "Roads & Transport"],
  ["P2", "Deliver climate-resilient urban districts", "Urban Planning"],
  ["P3", "Attract qualified foreign direct investment", "Investment & Trade"],
  ["P3", "Accelerate SME growth and export readiness", "SME Development"],
  ["P4", "Improve national education attainment", "Education Programmes"],
  ["P4", "Enhance preventive healthcare coverage", "Public Health Programmes"],
  ["P5", "Optimise government operating expenditure", "Finance & Budget"],
  ["P5", "Build a high-performing public workforce", "Human Resources"],
  ["P5", "Mature enterprise governance and assurance", "Strategy & Performance"],
];

export const objectives: Objective[] = objectiveSeeds.map(([pillarId, name, department], i) => {
  const performance = 55 + Math.round(rnd(i + 3) * 45);
  return {
    id: `OBJ-${String(i + 1).padStart(2, "0")}`,
    code: `OBJ-${String(i + 1).padStart(2, "0")}`,
    name,
    description: `${name}. Cascaded from ${pillars.find((p) => p.id === pillarId)!.name} and measured through weighted KPIs reported by the owning department.`,
    pillarId,
    owner: pick(PEOPLE, i + 11),
    department,
    weight: [10, 8, 12, 9, 7, 11, 6, 9, 8, 7, 6, 7][i],
    performance,
    status: performance >= 85 ? "on-track" : performance >= 70 ? "at-risk" : "off-track",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    history: [
      { date: "2026-01-15", actor: "Strategy & Performance", action: "Objective approved for FY2026" },
      { date: "2026-04-10", actor: pick(PEOPLE, i + 4), action: "Q1 performance review submitted" },
      { date: "2026-07-08", actor: pick(PEOPLE, i + 5), action: "Q2 actuals validated" },
    ],
  };
});

const PERIODS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

const kpiSeeds: [string, string, string, string][] = [
  ["OBJ-01", "Digital service availability", "%", "Service Uptime Platform"],
  ["OBJ-01", "Fully digitised journeys", "count", "Service Catalogue"],
  ["OBJ-02", "Critical vulnerabilities remediated within SLA", "%", "SOC Dashboard"],
  ["OBJ-02", "Mean time to detect incidents", "hours", "SIEM"],
  ["OBJ-03", "Citizen digital satisfaction index", "score", "National Survey"],
  ["OBJ-03", "Digital channel adoption rate", "%", "Analytics Platform"],
  ["OBJ-04", "Public transport ridership growth", "%", "Transport Authority"],
  ["OBJ-04", "Network coverage of urban population", "%", "GIS Registry"],
  ["OBJ-05", "Green building certified area", "k sqm", "Urban Planning Registry"],
  ["OBJ-06", "Foreign direct investment inflow", "M USD", "Investment Registry"],
  ["OBJ-06", "Investor licence processing time", "days", "Licensing System"],
  ["OBJ-07", "SME contribution to GDP", "%", "National Statistics"],
  ["OBJ-07", "SMEs supported with export finance", "count", "SME Portal"],
  ["OBJ-08", "Secondary education attainment rate", "%", "Education MIS"],
  ["OBJ-08", "Graduate employability within 12 months", "%", "Labour Market Survey"],
  ["OBJ-09", "Preventive screening coverage", "%", "Health Information System"],
  ["OBJ-09", "Chronic disease readmission rate", "%", "Hospital Records"],
  ["OBJ-10", "Operating expenditure variance", "%", "ERP Finance"],
  ["OBJ-10", "Shared services adoption", "%", "Corporate Services"],
  ["OBJ-11", "Employee engagement index", "score", "HR Survey"],
  ["OBJ-11", "Critical role vacancy rate", "%", "HRMS"],
  ["OBJ-12", "Internal audit findings closed", "%", "Audit Tracker"],
  ["OBJ-12", "Projects with approved governance baseline", "%", "PPM System"],
  ["OBJ-05", "Urban flood resilience index", "score", "Resilience Model"],
];

export const kpis: Kpi[] = kpiSeeds.map(([objectiveId, name, unit, dataSource], i) => {
  const obj = objectives.find((o) => o.id === objectiveId)!;
  const baseline = between(30, 70, i + 21);
  const target = between(baseline + 10, baseline + 40, i + 31);
  const actual = Math.round((target * (0.55 + rnd(i + 41) * 0.6)) * 10) / 10;
  const achievement = (actual / target) * 100;
  const status =
    achievement >= 95
      ? "on-track"
      : achievement >= 80
        ? "at-risk"
        : achievement > 0
          ? "off-track"
          : "not-reported";
  return {
    id: `KPI-${String(i + 1).padStart(3, "0")}`,
    code: `KPI-${String(i + 1).padStart(3, "0")}`,
    name,
    definition: `${name} measured for the ${obj.department} against the FY2026 approved performance baseline.`,
    formula:
      unit === "%"
        ? "(Achieved volume / Total eligible volume) × 100"
        : "Sum of reported period values",
    type: i % 3 === 0 ? "leading" : "lagging",
    objectiveId,
    owner: pick(PEOPLE, i + 7),
    department: obj.department,
    sector: SECTORS[i % SECTORS.length],
    dataSource,
    frequency: (["monthly", "quarterly", "quarterly", "annual"] as const)[i % 4],
    unit,
    baseline,
    target,
    actual: i === 23 ? 0 : actual,
    weight: [5, 4, 6, 3, 5, 4][i % 6],
    polarity: name.includes("time") || name.includes("rate of") || name.includes("variance") ? "decrease" : "increase",
    status: i === 23 ? "not-reported" : status,
    trend: PERIODS.map((period, p) => ({
      period,
      target: Math.round((target * (0.6 + p * 0.05)) * 10) / 10,
      actual: Math.round((actual * (0.55 + p * 0.06)) * 10) / 10,
    })),
  };
});

const initiativeSeeds: [string, string][] = [
  ["OBJ-01", "National Unified Services Platform Programme"],
  ["OBJ-02", "Cyber Defence Modernisation Programme"],
  ["OBJ-03", "Citizen Experience Transformation"],
  ["OBJ-04", "Integrated Mobility Masterplan Delivery"],
  ["OBJ-05", "Resilient Districts Programme"],
  ["OBJ-06", "Investment Attraction Acceleration"],
  ["OBJ-07", "SME Export Enablement Programme"],
  ["OBJ-08", "Future Skills & Curriculum Reform"],
  ["OBJ-09", "Preventive Health Outreach Programme"],
  ["OBJ-10", "Government Spend Optimisation"],
  ["OBJ-11", "Workforce Capability Uplift"],
  ["OBJ-12", "Enterprise Governance Maturity Programme"],
];

export const initiatives: Initiative[] = initiativeSeeds.map(([objectiveId, name], i) => {
  const obj = objectives.find((o) => o.id === objectiveId)!;
  const progress = between(25, 95, i + 51);
  const budget = between(8, 120, i + 61) * 1_000_000;
  return {
    id: `INI-${String(i + 1).padStart(2, "0")}`,
    code: `INI-${String(i + 1).padStart(2, "0")}`,
    name,
    description: `${name} consolidates the projects, policy changes and capability build required to deliver "${obj.name}".`,
    objectiveId,
    owner: pick(PEOPLE, i + 2),
    department: obj.department,
    progress,
    status: progress >= 90 ? "on-track" : progress >= 55 ? "at-risk" : "off-track",
    startDate: "2026-01-15",
    endDate: "2027-06-30",
    budget,
    actualCost: Math.round(budget * (0.3 + rnd(i + 71) * 0.6)),
    activities: Array.from({ length: 4 }, (_, a) => ({
      id: `ACT-${i + 1}-${a + 1}`,
      name: [
        "Baseline assessment & benchmarking",
        "Design & governance approval",
        "Delivery wave rollout",
        "Benefits realisation review",
      ][a],
      owner: pick(PEOPLE, i + a + 13),
      progress: Math.max(0, Math.min(100, progress + (a - 1) * 15)),
      due: ["2026-03-31", "2026-06-30", "2026-11-30", "2027-03-31"][a],
    })),
    history: [
      { date: "2026-01-20", actor: "Strategy Committee", action: "Initiative chartered and funded" },
      { date: "2026-05-12", actor: pick(PEOPLE, i + 9), action: "Scope change request CR-0" + (i + 1) + " approved" },
      { date: "2026-08-02", actor: pick(PEOPLE, i + 6), action: "Progress updated to " + progress + "%" },
    ],
  };
});

export const portfolios: Portfolio[] = [
  ["Digital Transformation Portfolio", "Digital Government Sector"],
  ["National Infrastructure Portfolio", "Infrastructure & Urban Sector"],
  ["Economic Growth Portfolio", "Economic Development Sector"],
  ["Social Development Portfolio", "Human Capital Sector"],
  ["Corporate Enablement Portfolio", "Corporate Services Sector"],
].map(([name, sector], i) => {
  const budget = between(120, 900, i + 81) * 1_000_000;
  const actualCost = Math.round(budget * (0.35 + rnd(i + 91) * 0.5));
  const performance = between(58, 94, i + 101);
  return {
    id: `PF-0${i + 1}`,
    code: `PF-0${i + 1}`,
    name,
    manager: PEOPLE[i],
    sector,
    budget,
    plannedCost: Math.round(budget * 0.82),
    actualCost,
    performance,
    health: performance >= 85 ? "green" : performance >= 70 ? "amber" : "red",
  };
});

const projectSeeds: [string, string, string][] = [
  ["PF-01", "INI-01", "Unified Digital Identity Rollout"],
  ["PF-01", "INI-01", "Government Service Bus Modernisation"],
  ["PF-01", "INI-02", "National SOC Capability Build"],
  ["PF-01", "INI-03", "Omnichannel Citizen Contact Centre"],
  ["PF-02", "INI-04", "Metro Line 3 Extension"],
  ["PF-02", "INI-04", "Smart Traffic Management Deployment"],
  ["PF-02", "INI-05", "Coastal Flood Defence Works"],
  ["PF-02", "INI-05", "District Cooling Network Phase II"],
  ["PF-03", "INI-06", "Investment Promotion Digital Gateway"],
  ["PF-03", "INI-07", "SME Export Finance Facility"],
  ["PF-03", "INI-06", "Free Zone Licensing Reform"],
  ["PF-04", "INI-08", "STEM Curriculum Modernisation"],
  ["PF-04", "INI-08", "National Skills Passport"],
  ["PF-04", "INI-09", "Community Screening Network"],
  ["PF-05", "INI-10", "Shared Services Consolidation"],
  ["PF-05", "INI-11", "Leadership Development Academy"],
  ["PF-05", "INI-12", "Enterprise PPM Platform Implementation"],
  ["PF-01", "INI-02", "Zero Trust Network Migration"],
];

const TASK_NAMES = [
  "Requirements & stakeholder workshops",
  "Solution architecture & design",
  "Vendor mobilisation",
  "Build / construction wave 1",
  "Integration & testing",
  "Change management & training",
  "Pilot deployment",
  "National rollout",
  "Handover & closure",
];

export const projects: Project[] = projectSeeds.map(([portfolioId, initiativeId, name], i) => {
  const progress = between(10, 98, i + 111);
  const budget = between(6, 260, i + 121) * 1_000_000;
  const actualCost = Math.round(budget * (0.2 + rnd(i + 131) * 0.85));
  const healthScore = progress - (actualCost / budget) * 100 + 25;
  const health = healthScore >= 25 ? "green" : healthScore >= 5 ? "amber" : "red";
  const ini = initiatives.find((x) => x.id === initiativeId)!;
  const startMonth = (i % 6) + 1;
  const phases = ["Initiation", "Design", "Delivery", "Closure"].map((p, k) => ({
    id: `PH-${i + 1}-${k + 1}`,
    name: p,
    start: `2026-${String(startMonth + k * 2).padStart(2, "0")}-01`,
    end: `2026-${String(Math.min(12, startMonth + k * 2 + 2)).padStart(2, "0")}-28`,
    progress: Math.max(0, Math.min(100, progress + (1 - k) * 25)),
  }));
  return {
    id: `PRJ-${String(i + 1).padStart(3, "0")}`,
    code: `PRJ-${String(i + 1).padStart(3, "0")}`,
    name,
    description: `${name} delivers a core component of the ${ini.name} and is governed under the ${portfolios.find((p) => p.id === portfolioId)!.name}.`,
    type: (["digital", "infrastructure", "capital", "operational", "policy"] as const)[i % 5],
    portfolioId,
    initiativeId,
    manager: pick(PEOPLE, i + 12),
    department: ini.department,
    startDate: `2026-${String(startMonth).padStart(2, "0")}-01`,
    endDate: `2027-${String(((i * 2) % 11) + 2).padStart(2, "0")}-28`,
    progress,
    budget,
    plannedCost: Math.round(budget * 0.9),
    actualCost,
    health,
    status: progress >= 100 ? "completed" : progress < 15 ? "planned" : "on-track",
    phases,
    tasks: TASK_NAMES.map((t, k) => ({
      id: `TSK-${i + 1}-${k + 1}`,
      name: t,
      phaseId: phases[Math.min(3, Math.floor(k / 3))].id,
      owner: pick(PEOPLE, i + k + 3),
      start: `2026-${String(Math.min(12, startMonth + k)).padStart(2, "0")}-05`,
      end: `2026-${String(Math.min(12, startMonth + k + 1)).padStart(2, "0")}-25`,
      progress: Math.max(0, Math.min(100, progress + (4 - k) * 12)),
      status: progress + (4 - k) * 12 >= 100 ? "completed" : k > 5 ? "planned" : "on-track",
      dependsOn: k > 0 ? `TSK-${i + 1}-${k}` : undefined,
    })),
    milestones: [
      "Governance baseline approved",
      "Design authority sign-off",
      "Go-live wave 1",
      "Benefits review complete",
    ].map((m, k) => ({
      id: `MS-${i + 1}-${k + 1}`,
      name: m,
      projectId: `PRJ-${String(i + 1).padStart(3, "0")}`,
      date: `2026-${String(Math.min(12, startMonth + 2 + k * 3)).padStart(2, "0")}-15`,
      status: (progress > (k + 1) * 22 ? "completed" : k === 1 ? "at-risk" : "planned") as Project["status"],
      owner: pick(PEOPLE, i + k + 8),
    })),
    deliverables: ["Solution blueprint", "Test acceptance report", "Operations handbook"].map(
      (d, k) => ({
        id: `DLV-${i + 1}-${k + 1}`,
        name: d,
        due: `2026-${String(Math.min(12, startMonth + 3 + k * 2)).padStart(2, "0")}-20`,
        status: (["approved", "under-review", "draft"] as const)[k],
        owner: pick(PEOPLE, i + k + 2),
      }),
    ),
    dependencies: [
      { id: `DEP-${i + 1}-1`, from: "Design authority sign-off", to: "Build / construction wave 1", type: "Finish-to-Start" },
      { id: `DEP-${i + 1}-2`, from: "Integration & testing", to: "Pilot deployment", type: "Finish-to-Start" },
    ],
    resources: [
      ["Programme Manager", 100, 950],
      ["Solution Architect", 60, 820],
      ["Business Analyst", 80, 540],
      ["Delivery Lead", 75, 700],
    ].map(([role, allocation, rate], k) => ({
      id: `RES-${i + 1}-${k + 1}`,
      name: pick(PEOPLE, i + k + 20),
      role: role as string,
      allocation: allocation as number,
      rate: rate as number,
      department: ini.department,
    })),
    documents: [
      { id: `DOC-${i + 1}-1`, name: "Project Charter v2.1.pdf", type: "Charter", uploaded: "2026-02-11", owner: pick(PEOPLE, i + 1) },
      { id: `DOC-${i + 1}-2`, name: "Detailed Schedule.xlsx", type: "Schedule", uploaded: "2026-05-04", owner: pick(PEOPLE, i + 2) },
      { id: `DOC-${i + 1}-3`, name: "Risk & Assurance Review.docx", type: "Assurance", uploaded: "2026-07-19", owner: pick(PEOPLE, i + 3) },
    ],
    activity: [
      { date: "2026-06-02", actor: pick(PEOPLE, i + 5), action: "Monthly status report published" },
      { date: "2026-07-14", actor: pick(PEOPLE, i + 6), action: "Change request raised for schedule extension" },
      { date: "2026-08-09", actor: pick(PEOPLE, i + 7), action: `Progress updated to ${progress}%` },
    ],
  };
});

const RISK_CATEGORIES = ["Delivery", "Financial", "Technical", "Regulatory", "Resource", "Vendor", "Cyber"];

export const risks: Risk[] = Array.from({ length: 22 }, (_, i) => {
  const project = projects[i % projects.length];
  const probability = between(1, 5, i + 141);
  const impact = between(1, 5, i + 151);
  const titles = [
    "Vendor resource ramp-up slower than contracted",
    "Integration with legacy registry may breach schedule",
    "Budget escalation due to material cost inflation",
    "Regulatory approval dependency outside entity control",
    "Cybersecurity clearance delays go-live",
    "Key technical specialist single point of failure",
    "Data quality gaps affect KPI reporting accuracy",
    "Stakeholder resistance to process change",
    "Contract variation exceeds delegated authority",
    "Site access constrained by utilities relocation",
    "Change adoption below target in pilot districts",
  ];
  return {
    id: `RSK-${String(i + 1).padStart(3, "0")}`,
    code: `RSK-${String(i + 1).padStart(3, "0")}`,
    title: titles[i % titles.length],
    entity: i % 4 === 0 ? "Initiative" : "Project",
    entityId: i % 4 === 0 ? initiatives[i % initiatives.length].id : project.id,
    category: RISK_CATEGORIES[i % RISK_CATEGORIES.length],
    probability,
    impact,
    owner: pick(PEOPLE, i + 15),
    mitigation:
      "Mitigation plan agreed with delivery partner; weekly tracking through the programme board with escalation thresholds defined.",
    dueDate: `2026-${String((i % 11) + 2).padStart(2, "0")}-25`,
    status: probability * impact >= 16 ? "escalated" : i % 5 === 0 ? "mitigating" : i % 7 === 0 ? "closed" : "open",
  };
});

export const issues: Issue[] = Array.from({ length: 14 }, (_, i) => ({
  id: `ISS-${String(i + 1).padStart(3, "0")}`,
  code: `ISS-${String(i + 1).padStart(3, "0")}`,
  title: [
    "Test environment unavailable for integration cycle",
    "Invoice backlog blocking supplier payments",
    "Scope disagreement with operating department",
    "Data migration defects exceeding tolerance",
    "Permit issuance delayed by third party",
    "Training attendance below required threshold",
    "Network latency impacting pilot users",
  ][i % 7],
  projectId: projects[i % projects.length].id,
  priority: (["critical", "high", "medium", "low"] as const)[i % 4],
  owner: pick(PEOPLE, i + 18),
  dueDate: `2026-${String((i % 11) + 2).padStart(2, "0")}-18`,
  status: (["open", "in-progress", "resolved", "escalated"] as const)[i % 4],
  resolution:
    i % 4 === 2 ? "Resolved with vendor patch and revalidated in regression cycle." : "Pending action owner update.",
}));

export const stakeholders: Stakeholder[] = Array.from({ length: 16 }, (_, i) => ({
  id: `STK-${String(i + 1).padStart(3, "0")}`,
  name: PEOPLE[i % PEOPLE.length],
  department: DEPARTMENTS[i % DEPARTMENTS.length],
  role: [
    "Undersecretary",
    "Director General",
    "Programme Sponsor",
    "Department Director",
    "Regulatory Liaison",
    "Delivery Partner Lead",
  ][i % 6],
  influence: between(2, 5, i + 161),
  interest: between(1, 5, i + 171),
  engagement: (["champion", "supportive", "neutral", "resistant"] as const)[i % 4],
  owner: pick(PEOPLE, i + 19),
  frequency: ["Weekly", "Bi-weekly", "Monthly", "Quarterly"][i % 4],
}));

export const correctiveActions: CorrectiveAction[] = Array.from({ length: 10 }, (_, i) => {
  const kpi = kpis.filter((k) => k.status !== "on-track")[i % Math.max(1, kpis.filter((k) => k.status !== "on-track").length)] ?? kpis[i];
  return {
    id: `CA-${String(i + 1).padStart(3, "0")}`,
    code: `CA-${String(i + 1).padStart(3, "0")}`,
    kpiId: kpi.id,
    description: `Recovery plan for ${kpi.name}: revise data collection cadence, reallocate delivery capacity and re-forecast the remaining periods.`,
    owner: kpi.owner,
    dueDate: `2026-${String((i % 10) + 3).padStart(2, "0")}-30`,
    status: (["open", "in-progress", "completed", "overdue"] as const)[i % 4],
  };
});

export const approvals: ApprovalRequest[] = Array.from({ length: 16 }, (_, i) => {
  const types = [
    "project-approval",
    "deliverable-approval",
    "change-request",
    "completion-certificate",
    "initiative-change",
    "risk-escalation",
  ] as const;
  const type = types[i % 6];
  const project = projects[i % projects.length];
  const labels: Record<(typeof types)[number], string> = {
    "project-approval": `Approval to baseline ${project.name}`,
    "deliverable-approval": `Deliverable sign-off — ${project.name} solution blueprint`,
    "change-request": `Change request — schedule extension for ${project.name}`,
    "completion-certificate": `Completion certificate — ${project.name} wave 1`,
    "initiative-change": `Initiative scope change — ${initiatives[i % initiatives.length].name}`,
    "risk-escalation": `Risk escalation — ${risks[i % risks.length].title}`,
  };
  return {
    id: `APR-${String(i + 1).padStart(3, "0")}`,
    code: `APR-${String(i + 1).padStart(3, "0")}`,
    title: labels[type],
    type,
    requester: pick(PEOPLE, i + 22),
    submittedAt: `2026-08-${String((i % 27) + 1).padStart(2, "0")}`,
    amount: type === "change-request" ? between(120, 4800, i + 181) * 1000 : undefined,
    status: (["submitted", "under-review", "draft", "approved", "rejected", "submitted"] as const)[i % 6],
    reference: project.code,
    notes: "Reviewed by the programme management office; supporting documentation attached in the governance pack.",
    history: [{ date: `2026-08-${String((i % 27) + 1).padStart(2, "0")}`, actor: pick(PEOPLE, i + 22), action: "Request submitted" }],
  };
});

export const notifications: Notification[] = [
  ["kpi-alert", "critical", "KPI off track: Foreign direct investment inflow", "Actual is 62% of the year-to-date target. Corrective action CA-003 is overdue.", "/performance/kpis"],
  ["project-delay", "warning", "Metro Line 3 Extension slipped 18 days", "Critical path task 'Integration & testing' finished late; recovery plan requested.", "/ppm/projects"],
  ["risk-escalation", "critical", "Risk RSK-004 escalated to Steering Committee", "Probability × Impact score reached 20 (Extreme).", "/risks"],
  ["approval", "info", "3 approvals awaiting your decision", "Includes 1 completion certificate and 2 change requests.", "/workflows"],
  ["deadline", "warning", "Milestone due in 5 days", "'Go-live wave 1' for Unified Digital Identity Rollout.", "/ppm/milestones"],
  ["performance", "warning", "Economic Diversification pillar below threshold", "Pillar performance is 68.9% against a 75% minimum tolerance.", "/strategy/overview"],
  ["kpi-alert", "info", "Monthly KPI submission window open", "18 of 24 KPIs have been reported for August 2026.", "/performance/kpi-dashboard"],
  ["project-delay", "warning", "Budget utilisation exceeded 90%", "Coastal Flood Defence Works consumed 92% of approved budget at 71% progress.", "/financials"],
].map(([type, severity, title, message, link], i) => ({
  id: `NTF-${String(i + 1).padStart(3, "0")}`,
  type: type as Notification["type"],
  severity: severity as Notification["severity"],
  title: title as string,
  message: message as string,
  link: link as string,
  createdAt: `2026-08-${String(27 - i).padStart(2, "0")}T09:${String(10 + i).padStart(2, "0")}:00`,
  read: i > 5,
}));

export const users: User[] = PEOPLE.map((name, i) => ({
  id: `USR-${String(i + 1).padStart(3, "0")}`,
  name,
  email: `${name.toLowerCase().replace(/[^a-z ]/g, "").replace(/ /g, ".")}@gov.example`,
  role: (
    [
      "Admin",
      "Executive",
      "Strategy Manager",
      "Performance Manager",
      "Project Manager",
      "Department Manager",
      "Viewer",
    ] as const
  )[i % 7],
  department: DEPARTMENTS[i % DEPARTMENTS.length],
  sector: SECTORS[i % SECTORS.length],
  status: (["active", "active", "active", "inactive", "suspended"] as const)[i % 5],
  lastLogin: `2026-08-${String(27 - (i % 20)).padStart(2, "0")} 08:${String(10 + i).padStart(2, "0")}`,
}));

export const orgNodes: OrgNode[] = [
  { id: "ORG-000", name: "Government Performance Centre", level: "center", head: PEOPLE[0], headcount: 4120, performance: 81 },
  ...SECTORS.map((s, i) => ({
    id: `ORG-S${i + 1}`,
    name: s,
    level: "sector" as const,
    parentId: "ORG-000",
    head: PEOPLE[i + 1],
    headcount: between(300, 1400, i + 191),
    performance: between(62, 93, i + 201),
  })),
  ...DEPARTMENTS.map((d, i) => ({
    id: `ORG-D${i + 1}`,
    name: d,
    level: "department" as const,
    parentId: `ORG-S${(i % 5) + 1}`,
    head: PEOPLE[(i + 3) % PEOPLE.length],
    headcount: between(40, 320, i + 211),
    performance: between(55, 96, i + 221),
  })),
];

export const reportHistory: ReportRun[] = Array.from({ length: 12 }, (_, i) => ({
  id: `RPT-${String(i + 1).padStart(3, "0")}`,
  name: [
    "Monthly Strategy Performance Report",
    "KPI Scorecard — All Sectors",
    "Portfolio Performance Summary",
    "Risk Exposure Report",
    "Milestone Status Report",
    "Benefits Realisation Report",
  ][i % 6],
  category: ["Strategy", "KPI", "Projects", "Risk", "Projects", "Projects"][i % 6],
  generatedAt: `2026-${String(8 - Math.floor(i / 2)).padStart(2, "0")}-0${(i % 5) + 1}`,
  period: `${["August", "July", "June", "May", "April", "March"][Math.floor(i / 2)]} 2026`,
  format: (["PDF", "Excel", "CSV"] as const)[i % 3],
  size: `${between(1, 9, i + 231)}.${between(1, 9, i + 241)} MB`,
  by: pick(PEOPLE, i + 25),
}));

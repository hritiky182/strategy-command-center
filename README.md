# Strategy Command Center

Build a high-fidelity, fully interactive static frontend demo for an enterprise Strategy, Performance, Project & Portfolio Management System based on the supplied SOW.

Goal

Create a professional government/enterprise-grade management application, NOT a marketing website.

Frontend only:

React + TypeScript + Vite

Tailwind CSS + shadcn/ui

React Router

Recharts

Lucide icons

Mock data + localStorage

No backend/API/authentication

Simulate CRUD and workflows locally

Design should be modern, clean, executive-friendly, data-rich, responsive and professional. Avoid excessive gradients, oversized cards and generic SaaS styling.

Application Layout

Sidebar

Dashboard

Strategy Management

Strategy Overview

Objectives

Initiatives

Strategy Map

Performance Management

KPI Dashboard

KPI Repository

KPI Scorecards

Corrective Actions

Project & Portfolio Management

Portfolios

Projects

Roadmap

Milestones

Resources

Risks & Issues

Stakeholders

Financial Management

Workflows & Approvals

Reports

Notifications

Administration

Header

Breadcrumbs

Global search

Notifications

Help

User/profile menu

Executive Dashboard

Create a highly polished dashboard containing:

Overall Strategy Performance

KPI Achievement

Active Initiatives

Active Projects

Projects At Risk

Open Risks

Budget Utilization

Portfolio Health

Charts for:

Strategy performance

KPI performance

Project health

Risk distribution

Budget vs actual

Performance by department/sector

Also show:

Strategic initiatives table

Upcoming milestones

Recent activity

Critical risks

Dashboard cards/charts must be clickable and navigate to filtered detail pages.

Strategy Management

Build:

Strategy Overview

Show:
Vision → Mission → Strategic Pillars → Objectives → KPIs → Initiatives → Projects

Objectives

Table with:
Objective, Pillar, Owner, Weight, Performance, Status, KPIs, Initiatives.

Objective Detail

Include:
Performance, linked KPIs, initiatives, projects, risks, history.

Strategy Map

Interactive visual relationship map with clickable nodes.

Initiatives

Table + detail page containing:
Owner, objective, progress, milestones, activities, KPIs, projects, risks, budget, change requests and history.

Performance / KPI Management

KPI Dashboard

Show:
Total, On Track, At Risk, Off Track, Not Reported.

Charts for:

KPI trends

Department performance

Strategic pillar performance

Leading vs lagging indicators

KPI Repository

Table:
KPI Code, Name, Type, Objective, Owner, Data Source, Frequency, Baseline, Target, Actual, Weight, Performance, Status.

Support:
Search, filtering, sorting, pagination, add/edit/delete/view.

KPI Detail

Show definition, formula, baseline, target, actual, weight, owner, historical trend, linked objectives/initiatives/projects and corrective actions.

Scorecard

Show:
Objective, KPI, Weight, Target, Actual, Achievement %, Weighted Score, Status, Trend.

Demonstrate cascading:
Center → Sector → Department → Objective → KPI

Project & Portfolio Management

Portfolio

Show:
Projects, budget, actual spend, utilization, performance, health, risks.

Projects

Table:
Code, Name, Type, Portfolio, Initiative, Manager, Dates, Progress, Budget, Actual Cost, Health, Status.

Project Detail Tabs

Overview

Plan

Tasks

Milestones

Deliverables

Dependencies

Resources

Financials

Risks

Issues

Change Requests

Documents

Stakeholders

Activity

Create a Gantt/timeline view with phases, tasks, milestones, dates, progress and dependencies.

Risks & Issues

Risk Register

Risk, Project/Initiative, Category, Probability, Impact, Score, Owner, Mitigation, Due Date, Status.

Include a Probability × Impact risk matrix.

Issues

Issue, Project, Priority, Owner, Due Date, Status, Resolution.

Support escalation.

Stakeholders

Show:
Stakeholder, Department, Role, Influence, Interest, Engagement, Owner, Communication Frequency.

Include Influence × Interest matrix.

Financial Management

At portfolio/project/initiative levels show:

Approved Budget

Planned Cost

Actual Cost

Remaining Budget

Variance

Utilization %

Include Budget vs Actual and spending trend charts.

Workflows & Approvals

Create approval center for:

Project approvals

Deliverable approvals

Change requests

Completion certificates

Initiative changes

Risk escalations

Workflow:
Draft → Submitted → Under Review → Approved/Rejected

Buttons must actually update local state.

Notifications

Create notification center for:

KPI alerts

Project delays

Risk escalations

Approval requests

Upcoming deadlines

Performance warnings

Support read/unread and filtering.

Reports

Create Reports module with:

Strategy

Objective Progress

Initiative Progress

Strategy Performance

KPI

KPI Progress

KPI Scorecard

Department Performance

Projects

Project Progress

Portfolio Performance

Milestones

Benefits Realization

Risk

Risk Register

Risk Exposure

Issues

Include filters, Generate Report, PDF/Excel/CSV export simulation and monthly report history.

Administration

Create:

Users

Users, roles, departments, status.

Roles & Permissions

Roles:
Admin, Executive, Strategy Manager, Performance Manager, Project Manager, Department Manager, Viewer.

Permissions:
View, Create, Edit, Delete, Approve, Export, Configure.

Organization

Center → Sector → Department

Configuration

Mock configuration for:

Forms

KPI/project statuses

Notifications

Escalation paths

Workflows

Reporting frequency

Permissions

Functionality

Everything should be interactive using mock/local data:

Routing

Search

Filters

Sorting

Pagination

CRUD

Forms + validation

Modals/drawers

Tabs

Toast notifications

Confirmation dialogs

Status/progress updates

Dashboard drill-down

Charts/tooltips

LocalStorage persistence

Maintain realistic relationships:

Strategy → Objective → KPI → Initiative → Project → Milestone → Task

Use realistic enterprise sample data, not "Test Project" or "Lorem ipsum".

Architecture

Use reusable components and TypeScript types.

Separate mock services from UI:

strategyService

kpiService

initiativeService

projectService

portfolioService

riskService

reportService

notificationService

userService

The mock services should be replaceable by real APIs later.

Quality

Ensure:

No blank pages

No dead core buttons

No broken routes

No placeholder content

Responsive desktop/tablet/mobile UI

Accessible forms and controls

Consistent status colors

Clean reusable components

No obvious console errors

The final result must look like a real executive enterprise/government platform ready for stakeholder demonstration, with the Executive Dashboard as the default landing page.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e010f160-9437-4157-8cc4-f2828760e48a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

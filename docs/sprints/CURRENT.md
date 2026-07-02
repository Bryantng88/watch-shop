# Current Sprint

## Status

Completed:
- Product Bible for Business Collaboration Platform
- Coordination Router Framework
- Coordination Event Consumer V1
- Coordination Cycle Resolver
- Fixed Work Type registry
- Auto-create fixed Work Tickets per Coordination Cycle
- Operation Coordination Workspace
- Queue Summary for Operation Work Tickets
- Sprint 27 language migration to Space Management vocabulary
- Sprint 28 Manual Workflow Engine V1 groundwork

Out of scope:
- Passing `taskItemId` through Watch URL/API
- Direct Watch -> Timeline calls
- Prisma rename from `TaskExecution` to `BusinessBinding`
- Prisma schema changes for Owner / Shared Users
- Business Domain changes
- Workflow / Notification changes
- Prisma model rename from Task/TaskItem/TaskExecution

Handoff:
- Read `docs/sprints/S027-S028-space-management-workflow-handoff.md`
- Read `docs/architecture/07-space-management-language.md`
- Read `docs/architecture/06-item-runtime-contract.md`

## How To Continue On Another Machine

1. `git pull`
2. `npm install` if needed
3. `npx prisma generate`
4. Read `docs/product/business-collaboration-platform.md`
5. Read `docs/sprints/S027-S028-space-management-workflow-handoff.md`
6. Read `docs/architecture/07-space-management-language.md`
7. Read `docs/architecture/06-item-runtime-contract.md`
8. Continue current sprint from `docs/sprints/CURRENT.md`

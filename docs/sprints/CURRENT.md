# Current Sprint

## Status

Completed:
- BusinessFeedback shared framework
- Timeline core
- Timeline consumer skeleton
- BusinessBinding abstraction

In progress:
- Timeline projection through BusinessBinding

Next:
- Timeline renderer contract
- TaskItem timeline UI
- Discussion/comment layer

Out of scope:
- Passing `taskItemId` through Watch URL/API
- Direct Watch -> Timeline calls
- Prisma rename from `TaskExecution` to `BusinessBinding`

## How To Continue On Another Machine

1. `git pull`
2. `npm install` if needed
3. `npx prisma generate`
4. Read `docs/architecture/*`
5. Continue current sprint from `docs/sprints/CURRENT.md`


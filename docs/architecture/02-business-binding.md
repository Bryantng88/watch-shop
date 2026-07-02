# Item

`Item` is the application-layer abstraction for mapping:

`Workspace <-> Business Object`

For now, the persisted Prisma model remains `TaskExecution`. Do not rename it.

Legacy vocabulary:

- `BusinessBinding` was the previous application-layer name.
- `TaskExecution` is still the Prisma storage table.

New server code should use Item vocabulary where possible:

- `ItemDTO`
- `ItemViewModel`
- `ItemSummaryDTO`
- `listWorkspaceItems()`
- `summarizeWorkspaceItems()`

Runtime role is virtual for now:

- `SERVICE_REQUEST` -> `SERVICE`
- `PAYMENT` -> `PAYMENT`
- `SHIPMENT` -> `SHIPMENT`
- `WATCH` -> `GENERAL`
- default -> `GENERAL`

Out of scope:

- Prisma rename from `TaskExecution` to `Item`.
- Persisting runtime role.

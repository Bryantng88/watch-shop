# BusinessBinding

`BusinessBinding` is the server abstraction for mapping:

`TaskItem <-> Business Object`

For now, the persisted Prisma model remains `TaskExecution`. Do not rename it yet.

New server code should use the BusinessBinding vocabulary:
- `BusinessBindingTargetType`
- `BusinessBindingActionType`
- `BusinessBindingRole`
- `BusinessBindingDTO`

`TaskExecution` remains the storage table. `BusinessBinding` is the domain abstraction over that table.

Role is virtual for now:
- `SERVICE_REQUEST` -> `SERVICE`
- `PAYMENT` -> `PAYMENT`
- `SHIPMENT` -> `SHIPMENT`
- `WATCH` -> `GENERAL`
- default -> `GENERAL`

Out of scope:
- Prisma rename from `TaskExecution` to `BusinessBinding`.
- Persisting `BusinessBindingRole`.


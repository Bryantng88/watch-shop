# Follow-up implementation plan: watch content, media, order notifications, and task bindings

Status: proposal only. None of the four changes below is implemented by this document.

This plan is intended to make the next development session portable to another machine. It records the expected behavior, likely integration points, constraints, and acceptance criteria before code changes begin.

## 1. Generated watch titles must retain the brand

### Problem

Production can generate or apply a title that omits the watch brand even when the product has a canonical `Brand` relation. This is especially visible when content generation and the watch identity form use different snapshots of the same data.

### Proposed approach

1. Treat `product.brand.name` as the canonical first choice.
2. Fall back to the submitted form brand name, then `watchSpecV2.brand` only when the canonical relation is absent.
3. Resolve the brand once and pass it into every title-generation path; do not let individual UI actions reconstruct it differently.
4. Ensure AI output cannot silently remove a known brand. When applying an AI title, normalize it through the same deterministic title builder or prepend the canonical brand when the generated title does not already begin with an equivalent normalized brand.
5. Preserve deliberate manual titles. The guard applies to generated/apply-title operations, not arbitrary user edits.

### Investigation points

- `src/domains/watch/application/generate-watch-content/generate-watch-content.helpers.ts`
- `src/domains/watch/ui/edit/WatchBasicSection.tsx`
- `src/domains/watch/ui/edit/RegenerateTitleSkuButton.tsx`
- `src/domains/watch/server/write/watch-write.service.ts`
- `src/domains/watch/application/submit-watch-form/submit-watch-form.application.ts`
- content draft/review APIs that hydrate `basic.brandName` and `spec.specBrand`

The first debugging step should compare the production payload reaching the generator with the persisted `product.brandId` and `product.brand.name`. The likely failure class is stale/incomplete form state or a precedence mismatch rather than a missing title formatter.

### Tests and acceptance criteria

- Canonical brand relation exists, spec brand empty: generated title starts with the canonical brand.
- Canonical brand relation and spec brand disagree: canonical brand wins.
- No relation, spec brand exists: spec brand is retained.
- Brand already appears in different case/spacing: it is not duplicated.
- Applying an AI-generated title cannot remove a known brand.
- A manually entered title is not rewritten during an unrelated save.

## 2. Select/deselect media directly from the image preview

### Problem

The large preview is currently navigation-only. Users must close it or locate the thumbnail to change selection, which is slow when reviewing many NAS images.

### Proposed interaction

- Preview opened from **Kho ảnh đã chọn tạm**: show a clear `Chọn ảnh` action.
- Preview opened from **Ảnh sẽ lưu cho watch**: show `Bỏ chọn` (return the image to the temporary pool, not NAS/recycle/delete).
- The action updates the same in-memory gallery/pool state used by the thumbnails.
- After the action, remain in preview and move to the nearest valid image. If the collection becomes empty, close the preview gracefully.
- Keyboard support: `Space` toggles selection; existing previous/next and Escape behavior remains.
- The footer must show source context (`Kho chọn tạm` or `Ảnh sẽ lưu`) and current selection state.

### Architecture constraints

- Do not duplicate move semantics in the preview component. Pass a stable asset key plus callbacks from `WatchImageSection`/the media state owner.
- Use canonical media keys (`getMediaKey`) rather than URLs or array indexes.
- Selection only changes pool/gallery membership. It must not call NAS return, recycle, post, or physical-delete actions.
- Preserve gallery order for remaining images and avoid duplicate assets across pool/gallery.
- The action is still draft state until the existing `Lưu cập nhật Hình ảnh` flow persists it.

### Investigation points

- `src/domains/watch/ui/edit/WatchImageSection.tsx`
- the shared media preview/lightbox used by the temporary pool and gallery
- media key helpers and the existing gallery/pool change callbacks

### Tests and acceptance criteria

- Select from temporary pool in preview; it appears once in gallery and disappears from the pool.
- Deselect from gallery in preview; it returns once to the temporary pool.
- Previous/next remains valid after removal from the current collection.
- No image is moved to NAS, Post, Recycle, or physical deletion.
- Save, reload, and reopen preserves the chosen pool/gallery state.
- Works with duplicate filenames stored under different canonical keys.

## 3. Notify the admin Zalo group when an order is created

### Problem

`order.created` is emitted, but the event contract currently lists timeline/projection consumers and production has no enabled Zalo rule for this event. Admins therefore do not receive a prompt notification from which they can decide whether a scheduled follow-up task is needed.

### Proposed approach

1. Keep order creation responsible only for emitting the existing idempotent `order.created` business event.
2. Add `notification` to the known consumers in the order event contract.
3. Enrich `ORDER/order.created` in the notification consumer with order reference, customer name/contact, total, payment state, delivery requirement, item summary, actor, and admin route.
4. Add a seeded/upserted `ZALO_OA` notification rule targeting the existing admin recipient group. Do not hard-code a group ID or credentials.
5. Use the existing `NotificationDispatch`/`NotificationChannelDelivery` idempotency mechanism so retries do not duplicate Zalo messages.
6. Notification failure must be recorded and retryable, but must never roll back a successfully created order.

### Suggested message

```text
Đơn hàng mới · {{orderRef}}
Khách hàng: {{customerName}} · {{phone}}
Giá trị: {{orderTotal}}
Thanh toán: {{paymentStatus}}
Giao hàng: {{deliverySummary}}
Sản phẩm: {{itemSummary}}
Mở xử lý: {{route}}
```

Templates should be Vietnamese-formatted by enriched fields rather than embedding formatting logic in the template.

### Investigation points

- `src/domains/order/server/write/order-write.service.ts`
- `src/domains/order/server/events/order-business-event.contract.ts`
- `src/domains/notification/server/notification-event-consumer.ts`
- notification rule/recipient-group seed or migration scripts
- existing purchase-request and media Zalo rules as the reference implementation

### Tests and acceptance criteria

- Creating a draft and/or posted order produces exactly the agreed notification event (confirm whether both paths should notify; recommended: `order.created` once, regardless of subsequent posting).
- One order creation produces one Zalo dispatch even after consumer retries.
- Message includes useful customer, value, delivery, item, and route information.
- Missing optional fields render explicit safe fallbacks; required template values do not silently produce a broken message.
- Zalo failure does not fail order creation and is visible as a failed channel delivery.
- No secrets or group IDs enter source control.

## 4. Bind one personal task to multiple business objects

### Problem

The personal-work UI currently accepts one `PersonalWorkTarget`. Real follow-up work can span multiple watches, orders, or requests.

### Existing capability to reuse

The task domain already persists multiple `TaskExecution` records and exposes bulk linking via `linkTaskExecutionsAction`. Personal work currently projects one execution through `targetFromExecution`, so the gap is primarily in the personal-work contract, hydration, validation, and UI—not necessarily a new database relation.

### Proposed model

- Replace the singular presentation field `target` with `targets: PersonalWorkTarget[]` in personal-work types and commands.
- Persist one active `TaskExecution` binding per target using the existing unique/idempotency rules.
- Allow multiple targets of the domain-compatible types. A single task may contain many watches or orders; mixed target types are permitted only when the selected personal-work domain explicitly allows them.
- Keep one task status, owner, due date, shares, and Calendar event. Targets are context, not child tasks.
- If each target needs its own completion/progress, create separate task items instead of overloading a single task.

### UI proposal

- Search results support multi-select.
- Selected objects appear as compact removable chips with type, primary label, and secondary reference.
- Collapse after the first 2–3 chips and show `+N` to keep the quick-create area compact.
- Task rows show the first target plus `+N đối tượng`; the edit modal shows all targets.
- Clicking a chip opens its business object. Removing a binding does not delete the business object or the task.

### Service behavior

- Validate every target and permission before writing any binding.
- Replace bindings transactionally: compute additions/removals and preserve unchanged executions.
- Deduplicate by `(targetType, targetId)`.
- Do not use `executions[0]` as the personal-work projection after migration.
- Calendar description should summarize at most a few targets and link back to the task for the full set.
- Activity/timeline entries should record binding additions/removals without producing duplicate operational tasks.

### Investigation points

- `src/domains/personal-work/shared/personal-work.types.ts`
- `src/domains/personal-work/server/personal-work.service.ts`
- `src/domains/personal-work/ui/PersonalWorkClient.tsx`
- `src/domains/task/actions/task-execution.actions.ts`
- `src/domains/task/server/execution/*`
- `prisma/schema.prisma` (`TaskExecution`)

### Tests and acceptance criteria

- Create one task linked to multiple watches.
- Create one task linked to multiple orders.
- Add/remove bindings during edit without recreating unchanged records.
- Duplicate selection is prevented in UI and server.
- Unauthorized or missing targets make the whole mutation fail atomically.
- List, detail, Calendar sync, shared-task view, and dashboard remain fast with many bindings.
- Existing single-target tasks load without migration or behavior regression.

## Recommended implementation order

1. Fix title/brand precedence and add regression tests.
2. Add preview selection callbacks (contained UI/state change).
3. Add order notification enrichment and seeded rule.
4. Generalize personal-work bindings last, reusing `TaskExecution` and updating the contract end-to-end.

Each item should be a separate scoped commit even if delivered in one pull request. Run focused domain tests after each commit, then the repository checks (`npm run lint`, `npx tsc --noEmit`, and `npm run build`) before requesting review.

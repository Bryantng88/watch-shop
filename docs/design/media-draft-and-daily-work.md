# Media drafts, completion and daily WatchShop work

Media sections have separate **Lưu tạm** and **Hoàn tất mục** actions. Draft saves
persist the current form but never count as completed work. Completing a section
requires an explicit action and saved data: title/spec, meaningful draft content,
gallery, or a confirmed cover as appropriate. Selecting a cover, existing review
approval/spec readiness and URL flags do not imply section completion. Changed
profile/content/gallery/cover data resets that part's active workspace progress.
Closed/returned work must be reopened through the existing workflow.

Completion indicators hide as soon as a section is edited. Save receipts retain
the actual submitted snapshot and preserve any newer typing/selection; late
responses never label those later edits saved or completed. Workspace context and
progress come from the matching Watch binding on the server, for embedded and full
media views. Final workspace approval retains its existing separate permission and
completion checks. Publication/review permissions remain unchanged.

**Tạo việc WatchShop** creates a checklist entry from the current Watch and section.
The user chooses the assignee and Vietnam working date, and describes the request.
There is exactly one parent created by this command per assignee/date. Stable
server-owned IDs plus serializable/advisory locking enforce this without a schema
change; request-key receipts make retries idempotent and reject changed payloads.
Additional entries reuse the parent; a completed parent reopens, preserving old
completed entries, while a cancelled parent requires explicit restoration. Generic
rescheduling/category edits cannot move this parent outside its fixed daily group.

The parent uses the WatchShop category, is owned by the assignee and appears in
Quản lý công việc. Each entry retains canonical Watch name/SKU, request and a safe
link to the correct media section. The caller needs current PRODUCT_UPDATE and
TASK_VIEW; assigning another person also needs TASK_MANAGE. Assignees must remain
active and eligible. A creator assigning someone else receives access only to their
own checklist entry via the existing checklist-share projection, not the other
entries in the recipient's day. Notifications use the existing transactional queue.
Task creation itself does not save or complete the Watch's media work.

Validation combines pure state/date/context tests, the existing PostgreSQL fixture
suite plus smoke-watch-media-daily.ts, and smoke-watch-media-ui.cjs using the actual
media form/dialog with synthetic section interiors/actions. Browser checks cover
reload, explicit completion, edits while saving, cover selection, context, focus
and mobile layout. No production record repair or deployment is included.

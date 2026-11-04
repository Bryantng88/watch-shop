# Current prototype scope: Products only

Context is temporarily enabled only for `/admin/watches` and `/admin/products`, including detail pages. Other screens show an inactive-context message and a link to Products. An already-started product conversation keeps its pinned product when navigating elsewhere. Empty product conversations follow the current screen; older non-product conversations remain stored but are hidden from this scoped history. The standalone local Sales AI entry is removed. No worker/production changes.

# Contextual AI assistant: phase 1

Local UI prototype only. No Codex calls, business-data lookups, task writes or notifications. The existing staging worker and production are unchanged.

Enable with the existing ignored local flag `SALES_AI_LOCAL_SIMULATION=1`, `NODE_ENV=development` and a loopback `APP_URL`. The server passes an opt-in boolean into the authenticated admin shell; production and remote origins fail closed. This supersedes the standalone Sales simulator UI locally. The real staging Sales path remains unchanged when the local flag is off.

## Review flow

1. Open any authenticated admin page. Use the fixed **Trợ lý AI / MẪU** button at bottom right. Desktop uses a side panel; mobile uses the full screen. Embedded admin views omit the assistant to avoid nested panels.
2. The current pathname suggests a screen or detail identifier. No record fields, customer data, filters or selection payloads are fetched or scraped. Labels currently use route identifiers, not business reference numbers. List pages explicitly say no record is selected.
3. Start from a suggested question or write a request. Try the normal, clarification, error and insufficient-permission sample scenarios. The scenario selector is prototype tooling, not a future business permission setting.
4. For a workflow proposal, edit titles/descriptions, departments, sample recipients and references to earlier steps. Remove a step and its dependency references are removed too. No deadlines are inferred.
5. Review the target and click **Xác nhận tạo N việc mẫu**. Before confirmation there are no result tasks. Repeated confirmation cannot append duplicate tasks. Sample result cards support manually changing displayed progress. They do not execute dependencies or link into real business queues.
6. Switch pages without changing the conversation's pinned context. The panel offers a new conversation for the current page; it does not silently switch targets. Remove context only before a plan/approval. A free conversation asks for an object description.
7. Close/reopen and reload: history is stored under a user-specific, versioned localStorage key, capped at 20 conversations and 40 messages each. Corrupt entries are ignored. Clear history with the History control; this deletes browser-local samples only. No sharing or server history exists. Local storage is not a security boundary or encrypted secret store; do not enter sensitive data.

`node --env-file=.env --import tsx scripts/seed-local-assistant-demo.ts` creates an idempotent `LOCAL-AI-DEMO-001` order only on the dedicated loopback test database (port 54339, database watch_shop_local_test_utf8). This fixture is separate from mock task confirmation. No NAS data is copied.

## Validation and limits

Run `node --import tsx --test src/domains/ai-assistant/simulation.test.ts`, changed-file ESLint and TypeScript. HTTP acceptance checks the launcher on Dashboard/Sales/the demo order and confirms the real Sales intake API remains disabled. Browser visual, keyboard/mobile and full click-through acceptance require an authenticated local browser tab; report them separately from server-render checks.

The user's actual TASK_MANAGE/ADMIN status can prevent mock approval, and the denied scenario demonstrates the refusal UI. These client-side controls are exclusively sample UX, not implementation of future server authorization. Phase 2 must verify every lookup and field scope on the server; phase 3 must reauthorize each real write after explicit user confirmation. Authentication, worker identity, quotas and audit controls must not be inferred from this prototype.

## Customer purchase request prototype

From Products, open the assistant and choose “Ghi nhận yêu cầu khách hàng có điều kiện”, or enter text mentioning a customer/purchase condition. The normal scenario creates an editable browser-only request draft; two clearly labelled example conditions are not an extraction of the input. Enter customer/watch and Sales owner, edit conditions and expected results, choose Technical request vs coordination Task and a sample assignee. Add/remove conditions (maximum 8), then explicitly approve. Approval requires complete fields and mock management permission, generates stable YC/KT/TASK sample references exactly once, and creates no business records or notifications.

After approval, simulate each linked item’s progress independently from the purchase-condition outcome (unverified/pass/fail/customer confirmation), record results and choose a Sales next-step note. Completed work does not imply a passed condition; passing all conditions never automatically creates an order. The request, assignments, references and results persist inside the existing user-scoped browser conversation history. Technical classification is an operator-reviewed prototype choice, not a verified mapping to the real technical registry. No server schema, migrations, worker, staging or production changes are included.

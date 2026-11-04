# AI assistant interaction contract

This contract governs all business-assistant UI and future extensions. It applies to the local simulator and the eventual live implementation. The agreed product direction is **conversation first, compact review, one explicit approval**.

## Required behavior

- The primary input and correction mechanism is natural-language chat.
- Do not embed business-data forms, metadata editors, multi-field cards, wizards, or per-field confirmation steps in the assistant. Do not hide a large form under an Edit/Details accordion as a workaround.
- The assistant gathers facts already provided in the conversation and the explicitly pinned, authorized product context. It asks concise questions only for facts that are missing, ambiguous or unsupported. Ask the most relevant missing question first; do not return a checklist for the user to fill out.
- Example: **“Bạn chưa cung cấp thông tin khách hàng. Khách tên hoặc mã gì?”** Then ask for SKU or recipient only if those remain missing. Do not repeat questions already answered.
- Missing customer, specific watch, condition, expected result or recipient means **no actionable review card and no Assign button**. Never display empty identities such as “Khách ·”. Recheck completeness from actual fields, not a cached ready flag; apply the same rule to old saved drafts.
- Never invent identities, recipients, conditions or business facts to complete a summary. Unsupported simulation input must be clarified, not presented as successful AI understanding.
- Once complete, show only a short customer/watch heading and lines of **condition/action → recipient**, with a brief technical-request/task label where needed. Avoid repeating the entire conversation or system implementation details.
- Offer one clear action such as **“Giao 2 việc”**. This is the single approval for the displayed request and assignments. Corrections such as “Giao mắt dây cho Minh” or “Bỏ chống nước” happen in chat and update the same pending summary. Corrections never create work by themselves.
- Approval must be idempotent. After approval, show compact progress/results; expand at most the item the user explicitly chooses to update. Optional item status/result controls must not become a required intake form or another approval wizard.
- Completion of a technical request/task does not imply that a purchase condition passed. Passing conditions does not create an order automatically.

## Context, permissions and simulation

An empty conversation follows the current supported product screen. After discussion starts, keep the product context pinned; changing pages must not silently retarget work. Other business contexts remain disabled until explicitly brought into scope.

Chat UX never replaces server-side authorization. Future live reads/writes must check the requesting user's scope and permissions; worker/Codex account privileges do not become user privileges. Previewing and approving must name the actual target and recipients. Local prototype controls are not authorization infrastructure.

Keep simulation visibly labelled but concise. Sample text/rules must not be described as real model inference, verified directory lookup, real technical classification or executed work. No business writes, external AI calls, notifications, NAS changes or deployment are authorized by this UX contract.

## Review acceptance

1. A complete sample request reaches a compact review without any form entry.
2. Missing customer produces a chat question, with no actionable card; answering it preserves previously supplied watch/conditions/recipients.
3. Missing SKU or recipient is asked next only when needed; no default person/watch is invented.
4. Chat corrections update the pending plan; removing a condition does not leave stale work in the review.
5. Old drafts with blank/whitespace identities are handled like new incomplete requests even if their saved ready flag is true or absent.
6. One approval creates the permitted result once. Reload/retry must not create duplicates.
7. No scenario requires opening an embedded business form to finish intake or correct a draft.

Implementation and local test instructions: [contextual assistant prototype](../development/contextual-ai-assistant-local.md).

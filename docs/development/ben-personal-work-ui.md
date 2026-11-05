# Ben personal-work visual refresh

This UI-only branch includes PR46 at c53dbd48 (and its PR41–45 dependencies). It replaces
heavy purple bubbles and the yellow staging row with pale lavender user messages,
white assistant cards, blue borders, a small staging label, chat/work navigation,
a visible current-screen link, a bounded auto-growing composer and editable quick
prompts. The account, order approval, task approval, reference prices, current-screen hints, persistent window and structured navigation protocols stay
unchanged. The Work tab shows actual requests/orders in the selected conversation,
not a fabricated daily summary. No attachment/microphone feature is implied.

The screen strip describes the current browser route. It does not claim the model
can read the screen or unsaved fields. Markdown supports paragraphs, emphasis,
lists and internal admin links. Raw HTML, model images and external/script links
remain inert; product photos keep their authorized server cards.

## Staging handoff

The Cloud session has no TCP grants to NAS, so this implementation task cannot
SSH/deploy. No staging container, environment, worker or production state changed.

Local operator: read the staging runbooks, compare the deployed revision against
this branch and reconcile any newer/local-only changes before building. Preserve
all existing flags, Calendar/OAuth settings, worker auth/work/secrets volumes,
private ingress and current worker. This refresh itself needs only the admin app
rebuilt (including npm lockfile); no migration or new worker protocol is introduced.
Use the authorized staging procedure, retain rollback container and validate
health, login, Ben history, navigation, order/task reviews and storefront separation.

Device checks: 390px and desktop panel, keyboard/safe areas, multiline input,
Markdown, photo switching, history/work/chat tabs, quick prompts (editable before
send), cancellation, one-approval order/task behavior, installed PWA and sign-out.
An isolated DOM interaction fixture passed; Chromium screenshot capture was not
available in this environment. Do not claim actual device acceptance from it.

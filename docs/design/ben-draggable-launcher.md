# Movable Ben launcher

The floating Ben button supports primary-pointer dragging on mouse and touch.
Moving at least six pixels starts a drag; releasing after a drag does not open
or close chat. A normal click/tap or keyboard Enter/Space keeps the existing toggle
and focus behavior. Alt + arrow keys move it by 24 pixels.

The button stays within the visible viewport with a 12-pixel inset. Window,
visual-viewport and button-size changes recalculate bounds. The normalized
position is kept in this browser's localStorage, survives navigation/reload and
adapts to phone rotation; no user/conversation data is stored. Unavailable or
invalid storage falls back to the bottom-right corner. The fullscreen Ben PWA
has no floating launcher, as before; the chat panel layout is unchanged.

`tests/pwa/ben-launcher-ui.cjs` renders the actual launcher and checks mouse/touch
movement, accidental-click suppression, ordinary/keyboard opening, focus return,
persistence, narrow/rotated viewport bounds and blocked storage. Its data and
HTTP server are local fixtures; it does not call production or send messages.

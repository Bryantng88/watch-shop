import { googleCalendarReadiness } from "@/domains/personal-work/server/google-calendar-config";
import { codexExecutionReadiness } from "@/domains/personal-work/server/codex/codex-config";
const calendar = googleCalendarReadiness();
const codex = codexExecutionReadiness();
// Presence/readiness only: never emit the client ID, secret, token key or database URL.
console.log(JSON.stringify({ calendar: { ready: calendar.ready, reason: calendar.reason, callback: calendar.redirectUri }, codex }, null, 2));
if (!calendar.ready || !codex.ready) process.exitCode = 1;

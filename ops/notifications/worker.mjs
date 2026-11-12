import { setTimeout } from "node:timers/promises";
const origin = process.env.WORK_PUSH_APP_URL || "http://app:3000";
const secret = process.env.INTERNAL_JOB_SECRET;
if (!secret) throw new Error("INTERNAL_JOB_SECRET is required for notification worker");
let stopping = false;
process.on("SIGTERM",()=>{stopping=true;});
process.on("SIGINT",()=>{stopping=true;});
while (!stopping) {
  try {
    const response = await fetch(`${origin}/api/internal/work-push/run`, {method:"POST",headers:{"x-internal-job-secret":secret},signal:AbortSignal.timeout(45000),redirect:"error"});
    if (!response.ok) console.error("Notification cycle failed",response.status);
  } catch { console.error("Notification service unavailable; retrying next cycle"); }
  await setTimeout(15000);
}

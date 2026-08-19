import { ensureProjectionReady } from "@/domains/projection/server/projection-read.service";
import { prisma } from "@/server/db/client";
import {
  FINANCE_REPORT_PROJECTION_KEY,
  queryFinanceReportProjection,
} from "./finance-report.projection";

export async function getFinanceReportApplication() {
  const readiness = await ensureProjectionReady(prisma, FINANCE_REPORT_PROJECTION_KEY);
  if (!readiness.ready) throw new Error(readiness.reason ?? "FINANCE_REPORT_PROJECTION_NOT_READY");
  const report = await queryFinanceReportProjection(prisma);
  if (!report) throw new Error("FINANCE_REPORT_PROJECTION_NOT_READY");
  return report;
}

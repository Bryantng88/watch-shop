import FinanceReportClient from "@/domains/report/finance/FinanceReportClient";
import { requireFinanceReportAccess } from "@/domains/report/finance/finance-report.access";
import { getFinanceReportApplication } from "@/domains/report/finance/get-finance-report.application";

export const dynamic = "force-dynamic";

export default async function FinanceReportPage() {
  await requireFinanceReportAccess();
  const data = await getFinanceReportApplication();
  return <FinanceReportClient initialProjection={data} />;
}

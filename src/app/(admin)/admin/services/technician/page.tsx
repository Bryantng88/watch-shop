import TechnicianWorkspace from "@/domains/service/client/technician/TechnicianWorkspace";
import { getTechnicianWorkspace } from "@/domains/service/server/technician/technician-workspace.query";
import { technicianSearch } from "@/domains/service/shared/technician-workspace";
export default async function TechnicianPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const data = await getTechnicianWorkspace(
    technicianSearch(await searchParams),
  );
  return <TechnicianWorkspace data={data} />;
}

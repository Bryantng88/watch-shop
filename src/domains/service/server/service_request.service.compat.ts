// Compatibility layer: dùng file này nếu còn import cũ từ service_request.service.ts.
// Sau khi đổi hết import sang domains/service/application hoặc domains/service/server/list thì có thể xóa.

export { getAdminServiceRequestList } from "./list/service-request-list.service";
export {
  createTechnicalChecksFromProductsApplication as createTechnicalChecksFromProducts,
  createTechnicalCheckFromAcquisitionApplication as createTechnicalCheckFromAcquisitionTx,
} from "../application/create-technical-checks-from-products.application";
export { finalizeTechnicalRequestApplication as finalizeTechnicalRequestTx } from "../application/finalize-technical-request.application";
export { bulkAssignVendorAndCreateMaintenanceApplication as bulkAssignVendorAndCreateMaintenance } from "../application/assign-service-vendor.application";
export { postServiceRequestsApplication as postServiceRequests } from "../application/post-service-requests.application";
export { completeServiceRequestApplication as completeServiceRequest } from "../application/complete-service-request.application";

import { prisma } from "@/server/db/client";

export async function getTechnicianOptions() {
  const rows = await prisma.user.findMany({
    where: { roles: { some: { name: "TECHNICIAN" } }, isActive: true },
    orderBy: [{ name: "asc" }, { email: "asc" }],
    select: { id: true, name: true, email: true },
  });
  return rows.map((u) => ({ id: u.id, name: (u.name || "").trim() || u.email, email: u.email }));
}

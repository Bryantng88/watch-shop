import { prisma } from "@/server/db/client";
import * as repoAcq from "../server";

function normalizeStatus(value: unknown) {
    return String(value ?? "").toUpperCase();
}

export async function cancelAcquisitionApplication(
    input: string | { acquisitionId: string }
) {
    const acquisitionId =
        typeof input === "string" ? input : String(input.acquisitionId ?? "").trim();

    if (!acquisitionId) {
        throw new Error("Thiếu id phiếu nhập");
    }

    const result = await prisma.$transaction(async (tx) => {
        const acq = await repoAcq.getAcqtById(acquisitionId, tx as any);

        if (!acq) {
            throw new Error("Không tìm thấy phiếu nhập");
        }

        if(acq.consignment)throw new Error("Hồ sơ ký gửi cần được xử lý tại Mua bán → Ký gửi.");
        const status = normalizeStatus(acq.accquisitionStt);

        if (status === "CANCELED" || status === "CANCELLED") {
            return acq;
        }

        if (status !== "DRAFT") {
            throw new Error("Chỉ phiếu DRAFT mới được hủy");
        }

        return repoAcq.cancelDraftAcquisition(tx as any, acquisitionId);
    });

    await repoAcq.emitAcquisitionBusinessEvent(prisma, {
        eventKey: "acquisition.canceled",
        acquisitionId,
    });

    return result;
}

export const cancelAcquisition = cancelAcquisitionApplication;

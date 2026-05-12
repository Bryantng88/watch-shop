"use server";

import { prisma } from "@/server/db/client";
import * as repoAcq from "../server";

export async function cancelAcquisitionApplication(
    input: string | { acquisitionId: string }
) {
    const id = typeof input === "string" ? input : input.acquisitionId;

    return prisma.$transaction(async (tx) => {
        const acq = await repoAcq.getAcqtById(id, tx as any);
        if (!acq) throw new Error("Không tìm thấy phiếu nhập");

        if (acq.accquisitionStt === "POSTED") {
            throw new Error("Không thể hủy phiếu đã đăng");
        }

        return repoAcq.cancelDraftAcquisition(tx as any, id);
    });
}

export const cancelAcquisition = cancelAcquisitionApplication;

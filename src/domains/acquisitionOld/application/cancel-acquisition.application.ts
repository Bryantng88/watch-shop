"use server";

import { prisma } from "@/server/db/client";
import * as repoAcq from "../server";

export async function cancelAcquisitionApplication(
    input: string | { acquisitionId: string }
) {
    const id = typeof input === "string" ? input : input.acquisitionId;
    const acq = await repoAcq.getAcqtById(id);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");

    if (acq.accquisitionStt === "POSTED") {
        throw new Error("Không thể hủy phiếu đã đăng");
    }

    return prisma.acquisition.update({
        where: { id },
        data: { accquisitionStt: "CANCELED" as any },
    });
}

export const cancelAcquisition = cancelAcquisitionApplication;

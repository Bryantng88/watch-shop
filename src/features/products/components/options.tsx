import { prisma } from "@/server/db/client";
import { CASE_TYPES, PRODUCT_TYPES, PRODUCT_STATUSES, MOVEMENT_TYPES } from "@/features/meta/server/enum";

export async function getOptions() {
    // các option tĩnh (enum)
    const status = Object.entries(PRODUCT_STATUSES).map(([key, value]) => ({
        label: value,
        value: key,
    }));

    const type = Object.entries(PRODUCT_TYPES).map(([key, value]) => ({
        label: value,
        value: key,
    }));

    const case_ = Object.entries(CASE_TYPES).map(([key, value]) => ({
        label: value,
        value: key,
    }));

    const movement = Object.entries(MOVEMENT_TYPES).map(([key, value]) => ({
        label: value,
        value: key,
    }));

    // complication lấy từ DB
    const complication = await prisma.complication.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    });

    return { status, type, case: case_, movement, complication };
}
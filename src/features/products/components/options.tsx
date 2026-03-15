import { prisma } from "@/server/db/client";
import {
    AVAILABILITY_STATUS,
    CASE_TYPES,
    PRODUCT_TYPES,
    MOVEMENT_TYPES,
} from "@/features/meta/server/enum";

export async function getOptions() {
    const status = (AVAILABILITY_STATUS as string[]).map((value) => ({
        label: value,
        value,
    }));

    const type = (PRODUCT_TYPES as string[]).map((value) => ({
        label: value,
        value,
    }));

    const case_ = (CASE_TYPES as string[]).map((value) => ({
        label: value,
        value,
    }));

    const movement = (MOVEMENT_TYPES as string[]).map((value) => ({
        label: value,
        value,
    }));

    const complication = await prisma.complication.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    });

    return {
        status,
        type,
        case: case_,
        movement,
        complication,
    };
}
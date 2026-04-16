import { prisma } from "@/server/db/client";
import {
    AvailabilityStatus,
    ProductType,
    ProductStatus,
    CaseType,
    MovementType,
    CaseMaterial,
    Gender,
    Strap,
    Glass,
    GoldColor,
} from "@prisma/client";

function enumOptions<T extends Record<string, string>>(enumObj: T) {
    return Object.values(enumObj).map((value) => ({ label: value, value }));
}

export async function getOptions() {
    const productStatus = enumOptions(ProductStatus);
    const availabilityStatus = enumOptions(AvailabilityStatus);
    const type = enumOptions(ProductType);
    const case_ = enumOptions(CaseType);
    const movement = enumOptions(MovementType);
    const caseMaterial = enumOptions(CaseMaterial);
    const gender = enumOptions(Gender);
    const strap = enumOptions(Strap);
    const glass = enumOptions(Glass);
    const goldColor = enumOptions(GoldColor);

    const complication = await prisma.complication.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    });

    return {
        productStatus,
        availabilityStatus,
        type,
        case: case_,
        movement,
        caseMaterial,
        gender,
        strap,
        glass,
        goldColor,
        complication,
    };
}

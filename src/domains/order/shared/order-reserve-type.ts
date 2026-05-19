import { ReserveType } from "@prisma/client";

export function normalizeReserveType(
    value?: string | null,
): ReserveType {
    const type = String(value ?? "").toUpperCase();

    switch (type) {
        case ReserveType.COD:
            return ReserveType.COD;

        case ReserveType.DEPOSIT:
            return ReserveType.DEPOSIT;

        default:
            return ReserveType.NONE;
    }
}

export function isDepositReserveType(
    value?: string | null,
) {
    return normalizeReserveType(value) === ReserveType.DEPOSIT;
}

export function isCodReserveType(
    value?: string | null,
) {
    return normalizeReserveType(value) === ReserveType.COD;
}

export function isFullPaymentReserveType(
    value?: string | null,
) {
    return normalizeReserveType(value) === ReserveType.NONE;
}
// src/shared/utils/serialize-for-client.ts

export function serializeForClient<T>(obj: T): T {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) {
                return value.toISOString();
            }

            if (
                typeof value === "object" &&
                value?._isDecimal
            ) {
                return Number(value);
            }

            return value;
        })
    );
}
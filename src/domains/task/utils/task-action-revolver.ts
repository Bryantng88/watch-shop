export type TaskActionKey =
    | "ORDER_CREATE"
    | "PAYMENT_LINK"
    | "SHIPMENT_LINK"
    | "SERVICE_CREATE"
    | "WATCH_PRICE_UPDATE"
    | "WATCH_CONTENT_EDIT"
    | "WATCH_IMAGE_EDIT";

function s(value: unknown) {
    return String(value ?? "").trim().toUpperCase();
}

export function resolveTaskActions(task: any): TaskActionKey[] {
    const domain = s(task?.domain);
    const taskTypeCode = s(task?.taskType?.code);
    const taskTypeName = s(task?.taskType?.name);

    const text = `${domain} ${taskTypeCode} ${taskTypeName}`;

    if (domain === "ORDER" || text.includes("ORDER") || text.includes("SALE")) {
        return ["ORDER_CREATE"];
    }

    if (domain === "PAYMENT" || text.includes("PAYMENT")) {
        return ["PAYMENT_LINK"];
    }

    if (domain === "SHIPMENT" || text.includes("SHIPMENT") || text.includes("DELIVERY")) {
        return ["SHIPMENT_LINK"];
    }

    if (domain === "SERVICE" || text.includes("SERVICE")) {
        return ["SERVICE_CREATE"];
    }

    if (domain === "WATCH" && text.includes("PRICE")) {
        return ["WATCH_PRICE_UPDATE"];
    }

    if (domain === "WATCH" && text.includes("CONTENT")) {
        return ["WATCH_CONTENT_EDIT"];
    }

    if (domain === "WATCH" && text.includes("IMAGE")) {
        return ["WATCH_IMAGE_EDIT"];
    }

    return [];
}
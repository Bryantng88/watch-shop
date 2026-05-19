import type {
    OrderFormInitialData,
    OrderFormItem,
    OrderFormValues,
    ProductSearchItem,
    QuickOrderProduct,
} from "./types";

export const PAYMENT_METHOD_OPTIONS = [
    { value: "BANK_TRANSFER", label: "Chuyển khoản" },
    { value: "CASH", label: "Tiền mặt" },
];

export const RESERVE_TYPE_OPTIONS = [
    { value: "NONE", label: "Thanh toán full" },
    { value: "DEPOSIT", label: "Deposit" },
    { value: "COD", label: "COD" },
];

export function normalizeOrderReserveType(value?: string | null) {
    const type = String(value ?? "").toUpperCase();

    if (type === "COD") return "COD";
    if (type === "DEPOSIT") return "DEPOSIT";

    return "NONE";
}

export function needsReserveAmount(value?: string | null) {
    const type = normalizeOrderReserveType(value);
    return type === "COD" || type === "DEPOSIT";
}

export function numberValue(value: string) {
    const n = Number(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
}

export function toDateTimeLocal(value?: string | Date | null) {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString().slice(0, 16);
}

export function normalizeInitialItems(
    initialData?: OrderFormInitialData | null,
): OrderFormItem[] {
    if (!Array.isArray(initialData?.items)) return [];

    return initialData.items.map((it: any) => ({
        id: it.id,
        kind: (it.kind || "PRODUCT") as "PRODUCT" | "SERVICE",
        productId: it.productId ?? null,
        variantId: it.variantId ?? null,
        title: it.title ?? "",
        sku: it.sku ?? null,
        quantity: it.createdFromFlow === "QUICK_ORDER" || it.source === "WATCH_QUICK_ORDER" ? 1 : Number(it.quantity ?? 1),
        listPrice: Number(it.listPrice ?? it.unitPriceAgreed ?? 0),
        unitPriceAgreed: Number(it.unitPriceAgreed ?? it.listPrice ?? 0),
        img: it.img ?? null,
        imageKey: it.imageKey ?? null,
        source: it.createdFromFlow ?? it.source ?? null,
        productStatus: it.productStatus ?? null,
        availabilityStatus: it.availabilityStatus ?? null,
        serviceCatalogId: it.serviceCatalogId ?? null,
        serviceScope: it.serviceScope ?? null,
        linkedOrderItemId: it.linkedOrderItemId ?? null,
        customerItemNote: it.customerItemNote ?? null,
    }));
}

// order/ui/form/helpers.ts

export function buildInitialOrderFormValues(
    initialData?: OrderFormInitialData | null,
): OrderFormValues {
    return {
        customerId: (initialData as any)?.customerId ?? null,
        customerName: initialData?.customerName ?? "",
        shipPhone: initialData?.shipPhone ?? "",

        hasShipment: Boolean(initialData?.hasShipment ?? false),
        shipAddress: initialData?.shipAddress ?? "",
        shipCity: initialData?.shipCity ?? "",
        shipDistrict: initialData?.shipDistrict ?? "",
        shipWard: initialData?.shipWard ?? "",

        paymentMethod: initialData?.paymentMethod === "COD" ? "BANK_TRANSFER" : initialData?.paymentMethod ?? "BANK_TRANSFER",
        notes: initialData?.notes ?? "",

        reserveType: normalizeOrderReserveType(initialData?.reserve?.type ?? (initialData?.paymentMethod === "COD" ? "COD" : null)),
        reserveAmount: Number(initialData?.reserve?.amount ?? 0),
        reserveExpiresAt: toDateTimeLocal(initialData?.reserve?.expiresAt ?? null),

        items: normalizeInitialItems(initialData),
    };
}


export function createProductFormItem(
    product: ProductSearchItem | QuickOrderProduct,
): OrderFormItem {
    const salePrice = Number(product.price || 0);
    const listPrice = Number(product.listPrice ?? product.price ?? 0);

    return {
        kind: "PRODUCT",
        productId: product.id,
        variantId: product.variantId ?? null,
        title: product.title || "Sản phẩm",
        sku: product.sku ?? null,
        quantity: 1,
        listPrice: Number.isFinite(listPrice) ? listPrice : 0,
        unitPriceAgreed: Number.isFinite(salePrice) ? salePrice : 0,
        img: product.primaryImageUrl ?? null,
        imageKey: product.imageKey ?? null,
        source: product.source ?? null,
        availabilityStatus: product.availabilityStatus ?? null,
        productStatus: product.productStatus ?? null,
        watchSaleState:
            "watchSaleState" in product ? product.watchSaleState ?? null : null,
        watchStockState:
            "watchStockState" in product ? product.watchStockState ?? null : null,
        watchServiceState:
            "watchServiceState" in product ? product.watchServiceState ?? null : null,
    };
}

export function getSubtotal(items: OrderFormItem[]) {
    return items.reduce(
        (sum, item) =>
            sum + Number(item.quantity || 1) * Number(item.unitPriceAgreed || 0),
        0,
    );
}

export function canEditOrder(status?: string | null) {
    return !status || status === "DRAFT" || status === "RESERVED";
}

export function buildOrderPayload(input: {
    values: OrderFormValues;
    quickMode: boolean;
    quickProductId?: string | null;
    status?: string | null;
    submitAs?: "DRAFT" | "POSTED";
}) {
    const values = input.values;

    return {
        customerId: values.customerId ?? null,
        customerName: values.customerName.trim(),
        shipPhone: values.shipPhone.trim(),
        hasShipment: values.hasShipment,
        shipAddress: values.shipAddress.trim(),
        shipCity: values.shipCity.trim(),
        shipDistrict: values.shipDistrict.trim(),
        shipWard: values.shipWard.trim(),
        paymentMethod:
            normalizeOrderReserveType(values.reserveType) === "COD"
                ? "COD"
                : values.paymentMethod,
        notes: values.notes.trim() || null,
        status: input.submitAs ?? input.status ?? "DRAFT",
        reserve: {
            type: normalizeOrderReserveType(values.reserveType),
            amount: needsReserveAmount(values.reserveType)
                ? Number(values.reserveAmount || 0)
                : 0,
            expiresAt:
                needsReserveAmount(values.reserveType) && values.reserveExpiresAt
                    ? new Date(values.reserveExpiresAt).toISOString()
                    : null,
        },
        quickFromProductId: input.quickMode ? input.quickProductId ?? null : null,
        quickFlowType: input.quickMode ? "QUICK_ORDER" : "STANDARD",
        items: values.items.map((item) => ({
            id: item.id,
            kind: item.kind,
            productId: item.productId ?? null,
            variantId: item.variantId ?? null,
            title: item.title,
            quantity: item.source === "WATCH_QUICK_ORDER" || input.quickMode ? 1 : Number(item.quantity || 1),
            listPrice: Number(item.listPrice || 0),
            unitPriceAgreed: Number(item.unitPriceAgreed || 0),
            img: item.img ?? null,
            serviceCatalogId: item.serviceCatalogId ?? null,
            serviceScope:
                item.kind === "SERVICE"
                    ? item.serviceScope ?? "CUSTOMER_ITEM"
                    : null,
            linkedOrderItemId:
                item.kind === "SERVICE" && item.serviceScope === "WITH_PURCHASE"
                    ? item.linkedOrderItemId ?? null
                    : null,
            customerItemNote:
                item.kind === "SERVICE" && item.serviceScope === "CUSTOMER_ITEM"
                    ? item.customerItemNote ?? null
                    : null,
            createdFromFlow: item.source === "WATCH_QUICK_ORDER" || input.quickMode
                ? "QUICK_ORDER"
                : "STANDARD",
        })),
    };
}

export function validateOrderForm(values: OrderFormValues) {
    if (!values.customerName.trim()) {
        return "Vui lòng nhập tên khách hàng.";
    }

    if (!values.items.length) {
        return "Vui lòng thêm ít nhất một sản phẩm hoặc dịch vụ.";
    }

    const reserveType = normalizeOrderReserveType(values.reserveType);
    const reserveAmount = Number(values.reserveAmount ?? 0);

    if ((reserveType === "COD" || reserveType === "DEPOSIT") && reserveAmount <= 0) {
        return reserveType === "COD"
            ? "Đơn COD phải có tiền cọc."
            : "Đơn deposit phải có tiền cọc.";
    }

    if (reserveType === "COD" && !values.hasShipment) {
        return "Đơn COD bắt buộc phải có giao hàng.";
    }

    if (values.hasShipment) {
        if (!values.shipPhone.trim()) return "Vui lòng nhập số điện thoại giao hàng.";
        if (!values.shipAddress.trim()) return "Vui lòng nhập địa chỉ giao hàng.";
        if (!values.shipCity.trim()) return "Vui lòng nhập tỉnh/thành phố khi có giao hàng.";
    }

    return null;
}

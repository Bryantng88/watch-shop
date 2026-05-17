export type ServiceOption = {
    id: string;
    code?: string | null;
    name: string;
    defaultPrice?: number | null;
    isActive?: boolean;
};

export type ProductSearchItem = {
    id: string;
    title: string;
    sku?: string | null;
    price: number;
    listPrice?: number | null;
    primaryImageUrl?: string | null;
    imageKey?: string | null;
    variantId?: string | null;
    availabilityStatus?: string | null;
    productStatus?: string | null;
    source?: "WATCH_QUICK_ORDER" | "STANDARD" | string | null;
};

export type QuickOrderProduct = ProductSearchItem & {
    source: "WATCH_QUICK_ORDER";
    watchSaleState?: string | null;
    watchStockState?: string | null;
    watchServiceState?: string | null;
};

export type OrderFormItem = {
    id?: string;
    kind: "PRODUCT" | "SERVICE";
    productId?: string | null;
    variantId?: string | null;
    title: string;
    sku?: string | null;
    quantity: number;
    listPrice: number;
    unitPriceAgreed: number;
    img?: string | null;
    imageKey?: string | null;
    source?: "WATCH_QUICK_ORDER" | "STANDARD" | string | null;
    availabilityStatus?: string | null;
    productStatus?: string | null;
    watchSaleState?: string | null;
    watchStockState?: string | null;
    watchServiceState?: string | null;
    serviceCatalogId?: string | null;
    serviceScope?: "WITH_PURCHASE" | "CUSTOMER_ITEM" | null;
    linkedOrderItemId?: string | null;
    customerItemNote?: string | null;
};

export type OrderFormValues = {
    customerName: string;
    shipPhone: string;

    hasShipment: boolean;
    shipAddress: string;
    shipCity: string;
    shipDistrict: string;
    shipWard: string;

    paymentMethod: string;
    notes: string;

    reserveType: string;
    reserveAmount: number;
    reserveExpiresAt: string;

    items: OrderFormItem[];
};

export type OrderFormMode = "create" | "edit";

export type OrderFormInitialData = {
    id?: string;
    status?: string | null;
    customerName?: string | null;
    shipPhone?: string | null;
    hasShipment?: boolean | null;
    shipAddress?: string | null;
    shipCity?: string | null;
    shipDistrict?: string | null;
    shipWard?: string | null;
    paymentMethod?: string | null;
    notes?: string | null;
    reserve?: {
        type?: string | null;
        amount?: number | null;
        expiresAt?: string | Date | null;
    } | null;
    items?: any[];
};

import { PaymentMethod, ReserveType, ServiceScope } from "@prisma/client";

export type OrderItemInput = {
    id?: string; // dùng cho edit (optional)
    kind: "PRODUCT" | "SERVICE" | "DISCOUNT";
    productId?: string | null;
    title: string;
    quantity: number;
    listPrice: number;
    variantId: string;
    unitPriceAgreed: number;
    img: string;
    serviceCatalogId?: string | null;
    serviceScope?: ServiceScope | null;

    // Nếu đi kèm sản phẩm: link tới OrderItem PRODUCT
    linkedOrderItemId?: string | null;

    // Nếu đồ khách mang tới: note mô tả
    customerItemNote?: string | null;

};

export type OrderDraftInput = {
    customerName: string;
    shipPhone: string;

    // shipment info
    hasShipment: boolean;
    shipAddress: string;
    shipCity: string;
    shipDistrict?: string | null;
    shipWard: string;

    // order info
    createdAt: string; // ISO
    paymentMethod: PaymentMethod;
    notes?: string | null;

    reserve?: {
        type: ReserveType;
        amount: number;
        expiresAt?: string | null;
    } | null;

    items: OrderItemInput[];
};

export type OrderDraftForEdit = {
    id: string;
    status: string;
    refNo: string | null;

    customerName: string;
    shipPhone: string | null;

    hasShipment: boolean | null;
    shipAddress: string | null;
    shipCity: string | null;
    shipDistrict: string | null;
    shipWard: string | null;

    createdAt: string | Date;
    paymentMethod: PaymentMethod;
    notes: string | null;

    reserveType: ReserveType | null;
    depositRequired: number | null;
    reserveUntil: string | Date | null;

    items: Array<{
        id: string;
        kind: string;
        productId: string | null;
        variantId?: string | null;
        title: string;
        quantity: number;
        listPrice: any;
        unitPriceAgreed?: any;
        img?: string | null;
        serviceCatalogId?: string | null;
        serviceScope?: ServiceScope | null;
        linkedOrderItemId?: string | null;
        customerItemNote?: string | null;
        taxRate?: any;
    }>;
};
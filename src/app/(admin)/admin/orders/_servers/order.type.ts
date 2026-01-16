import { PaymentMethod, ReserveType } from "@prisma/client";

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
    status: string; // DRAFT | RESERVED ...
    refNo: string | null;

    customerName: string;
    shipPhone: string | null;

    hasShipment: boolean | null;
    shipAddress: string | null;
    shipCity: string | null;
    shipDistrict: string | null;
    shipWard: string | null;

    createdAt: string; // ISO
    paymentMethod: PaymentMethod;
    notes: string | null;

    reserve: null | {
        type: ReserveType;
        amount: number;
        expiresAt: string | null;
    };

    items: Array<{
        id: string;
        kind: string;
        productId: string | null;
        title: string;
        quantity: number;
        unitPrice: any; // Decimal -> serialize ngoài page.tsx
    }>;
};

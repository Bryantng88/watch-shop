import { ProductStatus, ProductType } from "@prisma/client";

export type CreateProductDTO = {
    title: string;
    status: ProductStatus;
    type: ProductType;
    price: number;
    brandId?: string;        // chỉ là id thuần
    vendorId?: string;
    primaryImageUrl?: string | null;
    seoTitle?: string;
    seoDescription?: string;
    // ... các field khác
};

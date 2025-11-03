// src/features/products/types.ts
export type Sort = 'default' | 'low' | 'high';

export interface Filters {
    page?: number;
    sort?: Sort;
    brands?: string[];
    sizes?: string[];
    complications?: string[];
    categories?: string[];     // nếu bạn có enum ProductType thì dùng string[] tạm
    priceMin?: number;
    priceMax?: number;
}


export type BrandLite = { id: string; name: string };

export type ProductListItem = {
    id: string;
    title: string;
    contentStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    priceVisibility: "SHOW" | "HIDE";
    availabilityStatus: "ACTIVE" | "HIDDEN";
    minPrice: number | null;
    image?: string | null;
    updatedAt: string; // ISO
    createdAt: string; // ISO
};

export type ApiList<T> = { items: T[]; total?: number };
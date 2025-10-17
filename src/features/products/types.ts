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

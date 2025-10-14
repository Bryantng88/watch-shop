// features/catalog/server/types.ts
export type Sort = 'default' | 'low' | 'high';

export type Filters = {
    // Product
    brands?: string[];      // Brand.id[]
    categories?: string[];  // ProductType[]  (enum -> giá trị enum)
    // TODO: styles?: string[];
    // TODO: complications?: string[];
    complications?: string[];
    // ProductVariant
    priceMin?: number;
    priceMax?: number;
    // TODO: caseSizes?: string[];
    // TODO: dialColors?: string[];
    // TODO: materials?: string[];

    page?: number;
    sort?: Sort;
    sizes?: string[]
};

export type ProductCardData = {
    id: string;
    slug: string;
    title: string;
    brand: string;
    primaryImageUrl: string;
    price: number | null;
    tag: string;
    status?: 'sold' | 'on hold' | 'available';
    sizeCategory: string;

};

export function parseFilters(params: URLSearchParams): Filters {
    const arr = (v?: string | null) =>
        v ? v.split(',').map(s => s.trim()).filter(Boolean) : undefined;

    const n = (v?: string | null) => (v && !isNaN(+v) ? +v : undefined);

    return {
        complications: arr(params.get('complications')),
        brands: arr(params.get('brands')),
        categories: arr(params.get('categories')),
        priceMin: n(params.get('priceMin')),
        priceMax: n(params.get('priceMax')),
        sort: (['default', 'low', 'high'] as Sort[]).includes(params.get('sort') as Sort)
            ? (params.get('sort') as Sort) : 'default',
        page: n(params.get('page')) ?? 1,
        sizes: arr(params.get('sizes'))
    };
}

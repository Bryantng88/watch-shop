// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { productService } from '@/features/products/server/product.service';
import { FiltersSchema } from '@/features/products/schemas/product.schema';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const raw = Object.fromEntries(searchParams.entries());

    // cho phép mảng (brands=a&brands=b...) → lấy tất cả
    // URLSearchParams.entries() chỉ lấy cái cuối, nên ta rebuild thủ công:
    const ensureArray = (key: string) => searchParams.getAll(key);
    const parsed = FiltersSchema.parse({
        ...raw,
        brands: ensureArray('brands'),
        sizes: ensureArray('sizes'),
        complications: ensureArray('complications'),
        categories: ensureArray('categories'),
    });

    const data = await productService.list(parsed);
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const body = await req.json();
    const created = await productService.create(body);
    return NextResponse.json(created, { status: 201 });
}

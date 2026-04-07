import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/server/db/client';
import { requirePermissionApi } from '@/server/auth/requirePermissionApi';
import { PERMISSIONS } from '@/constants/permissions';
import * as prodRepo from '@/app/(admin)/admin/products/_server/product.repo';
import { buildRuleBasedContent, enhanceWithOpenAI, mergeProductWithDraft } from '@/app/(admin)/admin/products/_server/product-ai.server';

import type { ProductAiDraft } from '@/app/(admin)/admin/products/_server/product-ai.type';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: RouteContext) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
    if (auth instanceof Response) return auth;

    try {
        const { id } = await ctx.params;
        const draft = (await req.json().catch(() => null)) as ProductAiDraft | null;

        const product = await prodRepo.getAdminProductDetail(prisma, id);
        if (!product) {
            return NextResponse.json({ error: 'Không tìm thấy sản phẩm.' }, { status: 404 });
        }

        const merged = mergeProductWithDraft(product, draft);
        const rule = buildRuleBasedContent(merged);
        const { generated, meta } = await enhanceWithOpenAI(rule, merged);

        return NextResponse.json({ success: true, generated, meta }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message ?? 'Generate nội dung thất bại.' },
            { status: 400 }
        );
    }
}

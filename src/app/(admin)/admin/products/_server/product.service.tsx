import { CreateProductWithOutAcqInput, CreateProductWithOutAcqSchema } from "./product.dto";
import prisma from "@/server/db/client";
import { Prisma } from "@prisma/client";
import * as ultil from "./helper"
import * as prodRepo from "./product.repo"

export async function createProductDraft(input: unknown) {
    const dto = CreateProductWithOutAcqSchema.parse(input);
    return prisma.$transaction(async (tx) => {
        // 1) Vendor (select hoặc quick-add)

        // 2) Slug unique + SKU base
        const slug = await ultil.genUniqueSlug(tx, dto.title);
        const skuBase = slug; // single = slug

        // 3) Map ProductCreateInput
        const data: Prisma.ProductCreateInput = {
            title: dto.title,
            contentStatus: (dto.contentStatus as any) ?? "DRAFT",
            type: (dto.type as any) ?? "WATCH",
            slug, // có thể để Prisma default unique nếu bạn muốn
            brand: dto.brandId ? { connect: { id: dto.brandId } } : undefined,
            vendor: { connect: { id: dto.vendorId } },
            variants: ultil.buildVariants(dto, skuBase),
            watchSpec: ultil.buildWatchSpec(dto),
            primaryImageUrl:
                dto.primaryImageUrl === "" ? null : dto.primaryImageUrl ?? null,
            seoTitle: dto.seoTitle ?? undefined,
            seoDescription: dto.seoDescription ?? undefined,
        };
        // 4) Create Product
        const product = await prodRepo.createProductDraft(tx,
            data
        );

        return { productId: product.id };
    });
}

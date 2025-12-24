import { CreateProductWithOutAcqInput, CreateProductWithOutAcqSchema } from "./product.dto";
import { prisma, DB } from "@/server/db/client";
import { Prisma } from "@prisma/client";
import * as ultil from "./helper"
import * as prodRepo from "./product.repo"



export async function createProductDraft(title: string) {
    return prisma.$transaction(async (tx) => {
        const product = await prodRepo.createProductDraft(tx, { title })
        return product;
    });
}


// app/(admin)/admin/products/_server/product.service.ts

export async function detail(id: string) {
    return prisma.product.findUnique({
        where: { id },
    });
}

export async function updateProduct(
    id: string,
    patch: {
        title?: string;
        minPrice?: number | null;
        primaryImageUrl?: string | null;
        contentStatus?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
        priceVisibility?: "SHOW" | "HIDE";
        availabilityStatus?: "ACTIVE" | "HIDDEN";
    }
) {
    return prisma.$transaction(async (tx) => {
        // map field UI -> field DB (tuỳ schema của bạn)
        // Nếu DB bạn là primaryImageUrl thay vì image, đổi chỗ này:
        const data: any = {};

        if (patch.title !== undefined) data.title = patch.title;
        if (patch.minPrice !== undefined) data.minPrice = patch.minPrice;

        // ✅ nếu DB bạn lưu ở primaryImageUrl:
        // if (patch.image !== undefined) data.primaryImageUrl = patch.image;
        // ✅ nếu DB bạn lưu trực tiếp field image:
        if (patch.primaryImageUrl !== undefined) data.primaryImageUrl = patch.primaryImageUrl;

        if (patch.contentStatus !== undefined) data.contentStatus = patch.contentStatus;
        if (patch.priceVisibility !== undefined) data.priceVisibility = patch.priceVisibility;
        if (patch.availabilityStatus !== undefined) data.availabilityStatus = patch.availabilityStatus;
        console.log('in ra image url :' + patch.primaryImageUrl)
        const updated = await prodRepo.updateProduct(tx, id, data);

        // trả ra tối thiểu cho list
        return updated;
    });
}

export async function remove(id: string) {
    return prisma.$transaction(async (tx) => {
        await prodRepo.deleteProduct(tx, id);
        return { success: true };
    });
}

export async function searchProductService(q: string) {
    return prisma.$transaction(async (tx) => {
        return prodRepo.searchProductsRepo(tx, q);

    });
}



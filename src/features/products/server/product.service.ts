// src/features/products/server/product.service.ts
'use server';

import { CreateProductSchema, UpdateProductSchema, FiltersSchema } from '../schemas/product.schema';
import type { Filters } from '../types';
import { listProducts as repoListProducts } from '@/features/catalog/server/product-list.repo'
import prisma from '@/server/db/client';

export const productService = {
    // LIST + FILTER
    async list(filters: Filters) {
        // đã validate ở API, nhưng giữ an toàn nếu gọi trực tiếp
        const safe = FiltersSchema.parse(filters);
        return repoListProducts(safe);
    },

    // CRUD cơ bản trên Product
    async get(id: string) {
        return prisma.product.findUnique({ where: { id } });
    },

    async create(input: unknown) {
        const data = CreateProductSchema.parse(input);
        // tuỳ bạn, slug sẽ auto ở prisma.$extends khi create
        return prisma.product.create({ data });
    },

    async update(id: string, input: unknown) {
        const data = UpdateProductSchema.parse(input);
        return prisma.product.update({ where: { id }, data });
    },

    async remove(id: string) {
        await prisma.product.delete({ where: { id } });
        return { ok: true };
    },
};

// src/server/db/client.ts

import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

function makePrisma() {
    const base = new PrismaClient({
        log: ['error', 'warn'], // bật 'query' khi cần debug
    });

    // Tạo slug auto + đảm bảo unique cho Product khi create / upsert
    return base.$extends({
        query: {
            product: {
                async create({ args, query }) {
                    const data = args.data as any;

                    if (data?.title && !data.slug) {
                        let baseSlug = slugify(String(data.title), { lower: true, strict: true });
                        let slug = baseSlug;
                        let i = 1;
                        while (await base.product.findUnique({ where: { slug } })) {
                            slug = `${baseSlug}-${i++}`;
                        }
                        data.slug = slug;
                    }
                    return query(args);
                },

                async upsert({ args, query }) {
                    // upsert: chỉ set slug cho nhánh create nếu thiếu
                    const create = args.create as any;
                    if (create?.title && !create.slug) {
                        let baseSlug = slugify(String(create.title), { lower: true, strict: true });
                        let slug = baseSlug;
                        let i = 1;
                        while (await base.product.findUnique({ where: { slug } })) {
                            slug = `${baseSlug}-${i++}`;
                        }
                        create.slug = slug;
                    }
                    return query(args);
                },
            },
        },
    });
}

declare global {
    // giữ 1 instance duy nhất trong dev
    // eslint-disable-next-line no-var
    var prisma: ReturnType<typeof makePrisma> | undefined;
}

export const prisma = global.prisma ?? makePrisma();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;

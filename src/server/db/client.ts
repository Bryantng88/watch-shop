// src/server/db/client.ts

import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

function ensureVariantSkuForSingleProduct(variantsCreate: any, skuBase: string) {
    if (!variantsCreate) return;
    const assign = (node: any, index?: number) => {
        if (node && !node.sku) {
            // Nếu bạn CHẮC product SINGLE luôn chỉ có 1 variant => giữ nguyên skuBase
            // Nếu có khả năng >1 variant trong SINGLE, dùng hậu tố:
            node.sku = index != null ? `${skuBase}-${index + 1}` : skuBase;
        }
    };
    if (Array.isArray(variantsCreate)) {
        variantsCreate.forEach((v, i) => assign(v, i));
    } else {
        assign(variantsCreate);
    }
}


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
                    if (data?.type == 'WATCH') {
                        const vc = data?.variants?.create;
                        if (vc) {
                            const skuBase = data.slug ?? slugify(String(data.title ?? ''), { lower: true, strict: true });
                            ensureVariantSkuForSingleProduct(vc, skuBase);
                        }
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
                    if (create?.type == 'WATCH') {
                        const vc = create?.variants?.create;
                        if (vc) {
                            const skuBase = create.slug ?? slugify(String(create.title ?? ''), { lower: true, strict: true });
                            ensureVariantSkuForSingleProduct(vc, skuBase);
                        }
                    }

                    return query(args);
                },
            },
            productVariant: {
                async create({ args, query }) {
                    const data = args.data as any;

                    if (!data?.sku) {
                        // Tìm product gắn với variant
                        let productId: string | undefined;

                        // case productId gán trực tiếp
                        if (data.productId) productId = data.productId;

                        // case connect by id/slug
                        if (!productId && data.product?.connect) {
                            const c = data.product.connect as any;
                            if (c.id) productId = c.id;
                            else if (c.slug) {
                                const p = await base.product.findUnique({ where: { slug: c.slug }, select: { id: true } });
                                productId = p?.id;
                            }
                        }

                        if (productId) {
                            const p = await base.product.findUnique({
                                where: { id: productId },
                                select: { type: true, slug: true },
                            });

                            if (p?.type == 'WATCH' && p.slug) {
                                data.sku = p.slug; // SINGLE → sku = product.slug
                            }
                        }

                    }

                    return query(args);
                },

                async upsert({ args, query }) {
                    const create = args.create as any;

                    if (create && !create?.sku) {
                        let productId: string | undefined = create.productId;

                        if (!productId && create.product?.connect) {
                            const c = create.product.connect as any;
                            if (c.id) productId = c.id;
                            else if (c.slug) {
                                const p = await base.product.findUnique({ where: { slug: c.slug }, select: { id: true } });
                                productId = p?.id;
                            }
                        }

                        if (productId) {
                            const p = await base.product.findUnique({
                                where: { id: productId },
                                select: { type: true, slug: true },
                            });
                            if (p?.type == 'WATCH' && p.slug) {
                                create.sku = p.slug;
                            }
                        }
                        if (create?.type == 'WATCH') {
                            const vc = create?.variants?.create;
                            if (vc) {
                                const skuBase = create.slug ?? slugify(String(create.title ?? ''), { lower: true, strict: true });
                                ensureVariantSkuForSingleProduct(vc, skuBase);
                            }
                        }


                    }

                    return query(args);
                },
            },


            watchSpec: {
                async create({ args, query }) {
                    //đầu tiên cho xác định args là dữ liệu chưa dc định nghĩa
                    const data = args.data as any;


                    //nếu ko phải là 2 trường cần thao tác thì return luôn
                    if (!data?.length) {
                        return query(args)
                    }
                    type Rule = { min?: number; max?: number; category: string };
                    type CaseKey = "round" | "nonRound";
                    //định nghĩa quy luật về size
                    const rules = {
                        round: [
                            { max: 33, category: "Small" },
                            { min: 33, max: 39, category: "Medium" },
                            { min: 39, category: "Large" },

                        ],
                        nonRound: [
                            { max: 33, category: "Small" },
                            { min: 33, max: 35, category: "Medium" },
                            { min: 35, category: "Large" },
                        ]
                    } satisfies Record<CaseKey, ReadonlyArray<Rule>>;
                    const raw = String(data.caseType).toLowerCase();

                    if (raw in rules) {
                        const typeRule = rules[raw as CaseKey];
                        const found = typeRule.find((r) =>
                            (r.min === undefined || data.length >= r.min) &&
                            (r.max === undefined || data.length < r.max)
                        )

                        if (found) {
                            data.sizeCategory = found.category;
                            console.log("test nhanh" + found.category)
                        }
                    }
                    return query(args)

                }
            }

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

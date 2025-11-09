import { PrismaClient, Prisma } from '@prisma/client';
// ... các import khác (ví dụ slugify nếu bạn dùng)

declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// "DB" là kiểu union, "Tx" là TransactionClient
export type DB = PrismaClient | Prisma.TransactionClient;
export type Tx = Prisma.TransactionClient;
// Hàm lấy db hoặc transaction client
export const dbOrTx = (tx?: DB) => tx ?? prisma;

export default prisma;


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
                async create(this: typeof base, { args, query }) {
                    const client = Prisma.getExtensionContext(this) as PrismaClient;

                    const data = args.data as any;
                    if (data?.title && !data.slug) {
                        let baseSlug = slugify(String(data.title), { lower: true, strict: true });
                        let slug = baseSlug;
                        let i = 1;
                        while (await client.product.findUnique({ where: { slug } })) {
                            slug = `${baseSlug}-${i++}`;
                        }
                        data.slug = slug;
                    }
                    if (data?.type === 'WATCH') {
                        const vc = data?.variants?.create;
                        if (vc) {
                            const skuBase = data.slug ?? slugify(String(data.title ?? ''), { lower: true, strict: true });
                            ensureVariantSkuForSingleProduct(vc, skuBase);
                        }
                    }
                    if (data?.watchSpec?.create) {
                        const ws = data.watchSpec.create;
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
                        const raw = String(ws.caseType).toLowerCase();
                        console.log('test case type: ' + raw)
                        if (raw in rules) {
                            const typeRule = rules[raw as CaseKey];
                            const found = typeRule.find((r) =>
                                (r.min === undefined || data.watchSpec.length >= r.min) &&
                                (r.max === undefined || data.watchSpec.length < r.max)
                            )

                            if (found) {
                                ws.sizeCategory = found.category;
                            }
                        }
                    }
                    return query(args);
                },

                async upsert(this: PrismaClient, { args, query }) {
                    // upsert: chỉ set slug cho nhánh create nếu thiếu
                    const client = Prisma.getExtensionContext(this) as PrismaClient;
                    const create = args.create as any;
                    if (create?.title && !create.slug) {
                        let baseSlug = slugify(String(create.title), { lower: true, strict: true });
                        let slug = baseSlug;
                        let i = 1;
                        while (await client.product.findUnique({ where: { slug } })) {
                            slug = `${baseSlug}-${i++}`;
                        }
                        create.slug = slug;
                    }
                    if (create?.type === 'WATCH') {
                        const vc = create?.variants?.create;
                        console.log('[MW] watchSpec.create present bbbbbbbbbbb');
                        if (vc) {
                            const skuBase = create.slug ?? slugify(String(create.title ?? ''), { lower: true, strict: true });
                            ensureVariantSkuForSingleProduct(vc, skuBase);
                        }
                    }

                    return query(args);
                },
            },


            watchSpec: {
                async create(this: typeof base, { args, query }) {
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



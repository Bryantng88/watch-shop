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
                    console.log("watch spec create: " + data.sizeCategory)
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

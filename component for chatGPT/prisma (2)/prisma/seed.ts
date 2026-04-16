import { ProductType, ProductStatus, MovementType, CaseMaterial, Strap, Glass, Gender, CaseType } from '@prisma/client';
import { prisma } from '@/server/db/client';
import { brands } from '@/constants/constants';
import { complications } from '@/constants/constants';

async function main() {
    console.log('🌱 Seeding database...');

    // --- BRAND ---
    await Promise.all(
        brands.map((b) =>
            prisma.brand.upsert({
                where: { slug: b.slug },
                update: {
                    name: b.name,
                    country: b.country,
                    foundedYear: b.foundedYear,
                    website: b.website,
                    description: b.description,
                    logoUrl: `/uploads/brands/${b.slug}.png`, // đổi theo nơi bạn lưu logo
                },
                create: {
                    name: b.name,
                    slug: b.slug,
                    country: b.country,
                    foundedYear: b.foundedYear,
                    website: b.website,
                    description: b.description,
                    logoUrl: `/uploads/brands/${b.slug}.png`,
                },
            })
        )
    );
    await Promise.all(
        complications.map((name) =>
            prisma.complication.upsert({
                where: { name },
                update: {},
                create: { name },
            })
        )
    );


    {/*const speedmaster = await prisma.product.upsert({
        where: { slug: 'omega-speedmaster' },   // cần @unique trên Product.slug (bạn có)
        update: {},
        create: {
            title: 'Omega Speedmaster Moonwatch',
            type: ProductType.WATCH,
            status: ProductStatus.ACTIVE,
            brand: { connect: { slug: 'omega' } },
            primaryImageUrl: "http://longnd.myqnapcloud.com:8253/share.cgi/0001-251554421167544185%201.png?ssid=058cde3a6b5b4c318f17d74c58ff51d0&openfolder=normal&ep=&_dc=1758272903658&fid=058cde3a6b5b4c318f17d74c58ff51d0&filename=0001-251554421167544185%201.png",
            isStockManaged: true,
            maxQtyPerOrder: 1,
            watchSpec: {
                create: {
                    movement: MovementType.HAND_WOUND,
                    caseMaterial: CaseMaterial.STAINLESS_STEEL,
                    strap: Strap.LEATHER,
                    glass: Glass.SAPPHIRE,
                    year: '2022',
                    dialColor: 'Black',
                    gender: Gender.MEN,
                    width: 39.7,
                    length: 47,
                    thickness: 13.5,
                    complication: {
                        create: [
                            { name: 'Chronograph' },
                            { name: 'Moonphase' },
                        ],
                    },
                },
            },
            variants: {
                create: [
                    {
                        sku: 'OMEGA-MOON-001',
                        name: 'Omega Speedmaster Moonwatch Hesalite',
                        price: 250000000,
                        stockQty: 1,
                        isActive: true,
                    },
                ],
            },
        },
    });
    const rolex_submariner = await prisma.product.upsert({
        where: { slug: 'rolex-submariner' },   // cần @unique trên Product.slug (bạn có)
        update: {},
        create: {
            title: 'Rolex Submariner',
            type: ProductType.WATCH,
            status: ProductStatus.ACTIVE,
            brand: { connect: { slug: 'rolex' } },
            primaryImageUrl: "http://longnd.myqnapcloud.com:8253/share.cgi/0002-3934373108306276665.png?ssid=058cde3a6b5b4c318f17d74c58ff51d0&openfolder=normal&ep=&_dc=1758353299699&fid=058cde3a6b5b4c318f17d74c58ff51d0&filename=0002-3934373108306276665.png",
            isStockManaged: true,
            maxQtyPerOrder: 1,
            watchSpec: {
                create: {
                    movement: MovementType.AUTOMATIC,
                    caseMaterial: CaseMaterial.STAINLESS_STEEL,
                    strap: Strap.LEATHER,
                    glass: Glass.SAPPHIRE,
                    year: '2022',
                    dialColor: 'Black',
                    gender: Gender.MEN,
                    width: 39.7,
                    length: 47,
                    thickness: 13.5,
                    complication: {
                        connect: [
                            { name: 'Chronograph' },
                            { name: 'Moonphase' },
                        ],
                    },
                },
            },
            variants: {
                create: [
                    {
                        sku: 'ROLEX-MOON-001',
                        name: 'Rolex xyz',
                        price: 25000000,
                        stockQty: 1,
                        isActive: true,
                    },
                ],
            },
        },
    },
    );
    const cartier_santos = await prisma.product.upsert({
        where: { slug: 'cartier-santos' },   // cần @unique trên Product.slug (bạn có)
        update: {},
        create: {
            title: 'Cartier-santos',
            type: ProductType.WATCH,
            status: ProductStatus.HOLD,
            brand: { connect: { slug: 'cartier' } },
            primaryImageUrl: "http://longnd.myqnapcloud.com:8253/share.cgi/0002-3934373108306276665.png?ssid=058cde3a6b5b4c318f17d74c58ff51d0&openfolder=normal&ep=&_dc=1758353299699&fid=058cde3a6b5b4c318f17d74c58ff51d0&filename=0002-3934373108306276665.png",
            isStockManaged: true,
            maxQtyPerOrder: 1,
            watchSpec: {
                create: {
                    movement: MovementType.AUTOMATIC,
                    caseMaterial: CaseMaterial.STAINLESS_STEEL,
                    strap: Strap.LEATHER,
                    glass: Glass.SAPPHIRE,
                    year: '2022',
                    dialColor: 'Black',
                    gender: Gender.MEN,
                    width: 39.7,
                    length: 47,
                    thickness: 13.5,
                    complication: {
                        connect: [
                            { name: 'Chronograph' },
                        ],
                    },
                },
            },
            variants: {
                create: [
                    {
                        sku: 'cartier-chp-1',
                        name: 'cartier',
                        price: 55000000,
                        stockQty: 1,
                        isActive: true,
                    },
                ],
            },
        },
    },
    );

    const IWC = await prisma.product.upsert({
        where: { slug: 'iwc-tpc' },   // cần @unique trên Product.slug (bạn có)
        update: {},
        create: {
            title: 'iwc',
            slug: 'iwc-tpc',
            type: ProductType.WATCH,
            status: ProductStatus.SOLD,
            brand: { connect: { slug: 'iwc' } },
            primaryImageUrl: "http://longnd.myqnapcloud.com:8253/share.cgi/0002-3934373108306276665.png?ssid=058cde3a6b5b4c318f17d74c58ff51d0&openfolder=normal&ep=&_dc=1758353299699&fid=058cde3a6b5b4c318f17d74c58ff51d0&filename=0002-3934373108306276665.png",
            isStockManaged: true,
            maxQtyPerOrder: 1,
            watchSpec: {
                create: {
                    movement: MovementType.AUTOMATIC,
                    caseMaterial: CaseMaterial.STAINLESS_STEEL,
                    strap: Strap.LEATHER,
                    glass: Glass.SAPPHIRE,
                    year: '2022',
                    dialColor: 'Black',
                    gender: Gender.MEN,
                    width: 39.7,
                    length: 47,
                    thickness: 13.5,
                    complication: {
                        connect: [
                            { name: 'Chronograph' },
                        ],
                    },
                },
            },
            variants: {
                create: [
                    {
                        sku: 'iwc-tpc-1',
                        name: 'iwc',
                        price: 55000000,
                        stockQty: 1,
                        isActive: true,
                    },
                ],
            },
        },
    },
    ); const hamilton = await prisma.product.upsert({
        where: { slug: 'hamilton-xyz' },   // cần @unique trên Product.slug (bạn có)
        update: {},
        create: {
            title: 'Hamilton XYZ',
            type: ProductType.WATCH,
            status: ProductStatus.SOLD,
            brand: { connect: { slug: 'hamilton' } },
            primaryImageUrl: "http://longnd.myqnapcloud.com:8253/share.cgi/0002-3934373108306276665.png?ssid=058cde3a6b5b4c318f17d74c58ff51d0&openfolder=normal&ep=&_dc=1758353299699&fid=058cde3a6b5b4c318f17d74c58ff51d0&filename=0002-3934373108306276665.png",
            isStockManaged: true,
            maxQtyPerOrder: 1,
            watchSpec: {
                create: {
                    movement: MovementType.AUTOMATIC,
                    caseMaterial: CaseMaterial.STAINLESS_STEEL,
                    strap: Strap.LEATHER,
                    glass: Glass.SAPPHIRE,
                    year: '2022',
                    dialColor: 'Black',
                    gender: Gender.MEN,
                    width: 39.7,
                    length: 47,
                    thickness: 13.5,
                    complication: {
                        connect: [
                            { name: 'Chronograph' },
                        ],
                    },
                },
            },
            variants: {
                create: [
                    {
                        sku: 'hamilton-abcd-1',
                        name: 'hamilton',
                        price: 55000000,
                        stockQty: 1,
                        isActive: true,
                    },
                ],
            },
        },
    },
    );

    const seiko = await prisma.product.upsert({
        where: { slug: 'seiko-xyz-the-most-beautiful' },   // cần @unique trên Product.slug (bạn có)
        update: {},
        create: {
            title: 'Seiko  XYZ The Most Beautiful',
            type: ProductType.WATCH,
            status: ProductStatus.HOLD,
            brand: { connect: { slug: 'seiko' } },
            primaryImageUrl: "http://longnd.myqnapcloud.com:8253/share.cgi/0008-155853023759813919.png?ssid=058cde3a6b5b4c318f17d74c58ff51d0&openfolder=normal&ep=&_dc=1758353355474&fid=058cde3a6b5b4c318f17d74c58ff51d0&filename=0008-155853023759813919.png",
            isStockManaged: true,
            maxQtyPerOrder: 1,
            watchSpec: {
                create: {
                    movement: MovementType.AUTOMATIC,
                    caseMaterial: CaseMaterial.STAINLESS_STEEL,
                    strap: Strap.LEATHER,
                    glass: Glass.SAPPHIRE,
                    year: '2022',
                    dialColor: 'Black',
                    gender: Gender.MEN,
                    width: 39.7,
                    length: 47,
                    thickness: 13.5,
                    complication: {
                        connect: [
                            { name: 'GMT' },
                        ],
                    },
                },
            },
            variants: {
                create: [
                    {
                        sku: 'seiko-tpzc-1',
                        name: 'seiko',
                        price: 6500000,
                        stockQty: 1,
                        isActive: true,
                    },
                ],
            },
        },
    },
    );


    const longines = await prisma.product.upsert({
        where: { slug: 'longines' },   // cần @unique trên Product.slug (bạn có)
        update: {},
        create: {
            title: 'longines',
            type: ProductType.WATCH,
            status: ProductStatus.ACTIVE,
            brand: { connect: { slug: 'longines' } },
            primaryImageUrl: "http://longnd.myqnapcloud.com:8253/share.cgi/0009-251554421167544185%209.png?ssid=058cde3a6b5b4c318f17d74c58ff51d0&openfolder=normal&ep=&_dc=1758273138456&fid=058cde3a6b5b4c318f17d74c58ff51d0&filename=0009-251554421167544185%209.png",
            isStockManaged: true,
            maxQtyPerOrder: 1,

            variants: {
                create: [
                    {
                        sku: 'longines-tpc-1',
                        name: 'longines',
                        price: 18760000,
                        stockQty: 1,
                        isActive: true,
                    },
                ],
            },
        },
        select: { id: true },
    });

    await prisma.watchSpec.create({
        data: {

            product: { connect: { slug: 'longines' } },
            movement: MovementType.AUTOMATIC,
            caseMaterial: CaseMaterial.STAINLESS_STEEL,
            strap: Strap.LEATHER,
            glass: Glass.SAPPHIRE,
            caseType: CaseType.ROUND,
            year: '2022',
            dialColor: 'Black',
            gender: Gender.MEN,
            width: 39.7,
            length: 35,
            thickness: 13.5,
            complication: {
                connect: [
                    { name: 'GMT' },
                ],

            },
        },

    })

*/}


    // --- PRODUCT ---


    console.log('✅ Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

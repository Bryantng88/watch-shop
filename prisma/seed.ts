import { PrismaClient, ProductType, ProductStatus, MovementType, CaseMaterial, Strap, Glass, Gender } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // --- BRAND ---
    const rolex = await prisma.brand.upsert({
        where: { slug: 'rolex' },
        update: {},
        create: {
            name: 'Rolex',
            slug: 'rolex',
            country: 'Switzerland',
            foundedYear: 1905,
            website: 'https://www.rolex.com',
            logoUrl: '/uploads/rolex-logo.png',
            description: 'Luxury Swiss watch manufacturer.',
        },
    });

    const omega = await prisma.brand.upsert({
        where: { slug: 'omega' },
        update: {},
        create: {
            name: 'Omega',
            slug: 'omega',
            country: 'Switzerland',
            foundedYear: 1848,
            website: 'https://www.omegawatches.com',
            logoUrl: '/uploads/omega-logo.png',
            description: 'Precision timepieces from Switzerland.',
        },
    });

    const cartier = await prisma.brand.upsert({
        where: { slug: 'cartier' },
        update: {},
        create: {
            name: 'Cartier',
            slug: 'cartier',
            country: 'Switzerland',
            foundedYear: 1848,
            website: 'https://www.omegawatches.com',
            logoUrl: '/uploads/omega-logo.png',
            description: 'Precision timepieces from Switzerland.',
        },
    });
    const speedmaster = await prisma.product.upsert({
        where: { slug: 'omega-speedmaster' },   // cần @unique trên Product.slug (bạn có)
        update: {},
        create: {

            title: 'Omega Speedmaster Moonwatch',
            slug: 'omega-speedmaster',
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
            slug: 'rolex-submariner',
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

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
    const speedmaster = await prisma.product.create({
        data: {
            title: 'Omega Speedmaster Moonwatch',
            slug: 'omega-speedmaster',
            type: ProductType.WATCH,
            status: ProductStatus.ACTIVE,
            brandId: omega.id,
            primaryImageUrl: '/uploads/speedmaster-main.jpg',
            isStockManaged: true,
            maxQtyPerOrder: 1,
            watchSpec: {
                create: {
                    movement: MovementType.HAND_WOUND,
                    caseMaterial: CaseMaterial.STAINLESS_STEEL,
                    year: '2022',
                    length: 36,
                    width: 36,
                    thickness: 13.2,
                    dialColor: 'Black',
                    strap: Strap.LEATHER,
                    glass: Glass.SAPPHIRE,
                    gender: Gender.MEN,
                    complication: {
                        create: [
                            { name: "Chronograph" }, { name: "Moonphase" }
                        ]
                    }
                }
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

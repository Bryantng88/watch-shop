import { PrismaClient, ProductType, ProductStatus, MovementType, CaseMaterial } from '@prisma/client';

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

    // --- PRODUCT ---
    const daytona = await prisma.product.create({
        data: {
            title: 'Rolex Cosmograph Daytona',
            slug: 'rolex-daytona',
            type: ProductType.WATCH,
            status: ProductStatus.ACTIVE,
            brandId: rolex.id,
            primaryImageUrl: '/uploads/daytona-main.jpg',
            isStockManaged: true,
            maxQtyPerOrder: 1,

            // Quan hệ WatchSpec
            watchSpec: {
                create: {
                    movement: MovementType.AUTOMATIC,
                    caseMaterial: CaseMaterial.STAINLESS_STEEL,
                    year: 2023,
                    diametermm: 40,
                    thicknessmm: 12.4,
                    dialColor: 'Black',
                    strap: 'Oystersteel',
                },
            },

            // Quan hệ hình ảnh
            image: {
                create: [
                    {
                        fileKey: 'daytona-front.jpg',
                        alt: 'Rolex Daytona front view',
                        role: 'GALLERY',
                        sortOrder: 0,
                    },
                    {
                        fileKey: 'daytona-side.jpg',
                        alt: 'Rolex Daytona side view',
                        role: 'GALLERY',
                        sortOrder: 1,
                    },
                ],
            },
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
                    movement: MovementType.MANUAL_WINDING,
                    caseMaterial: CaseMaterial.STAINLESS_STEEL,
                    year: 2022,
                    diametermm: 42,
                    thicknessmm: 13.2,
                    dialColor: 'Black',
                    strap: 'NATO Fabric',
                },
            },
        },
    });

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

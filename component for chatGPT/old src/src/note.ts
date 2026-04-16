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
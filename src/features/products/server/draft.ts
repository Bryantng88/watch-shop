async update(id: string, input: unknown) {
    const dto: UpdateProductWithAcqInput = UpdateProductWithAcqSchema.parse(input);
    const { image, complicationIds, price, stockQty, ...rest }: UpdateProductWithAcqInput = dto;
    const list = Array.isArray(dto.complicationIds) ? (dto.complicationIds as string[]) : [];
    const compSet = list.length ? { set: list.map(id => ({ id })) } : undefined;
    const compConnect = list.length ? { connect: list.map(id => ({ id })) } : undefined;
    return prisma.$transaction(async (tx) => {
        // 1) Update core fields + watchSpec + complications
        const updated = await tx.product.update({
            where: { id },
            data: {
                ...clean({
                    title: rest.title,
                    status: rest.status,
                    seoTitle: rest.seoTitle,
                    seoDescription: rest.seoDescription,
                    type: rest.productType,
                    primaryImageUrl: rest.primaryImageUrl ?? undefined,
                    brand: rest.brandId ? { connect: { id: rest.brandId } } : undefined,
                }),
                // watchSpec: update hoặc upsert (nếu có sản phẩm WATCH)
                watchSpec:
                    rest.type === 'WATCH'
                        ? ({
                            upsert: {
                                // UPDATE: dùng { set: ... } và cast sang enum
                                update: clean({
                                    caseType: rest.caseType
                                        ? { set: rest.caseType as CaseType }
                                        : undefined,
                                    gender: rest.gender
                                        ? { set: rest.gender as Gender }
                                        : undefined,
                                    movement: rest.movement
                                        ? { set: rest.movement as MovementType }
                                        : undefined,

                                    length:
                                        rest.length != null
                                            ? { set: Number(rest.length) }
                                            : undefined,
                                    width:
                                        rest.width != null
                                            ? { set: Number(rest.width) }
                                            : undefined,
                                    thickness:
                                        rest.thickness != null
                                            ? { set: Number(rest.thickness) }
                                            : undefined,
                                    ...(compSet ? { complication: compSet } : {}),

                                }) as Prisma.WatchSpecUpdateWithoutProductInput,

                                // CREATE: truyền đúng enum/number
                                create: clean({
                                    caseType:
                                        (rest.caseType as CaseType) ?? CaseType.ROUND,
                                    gender: (rest.gender as Gender) ?? Gender.MEN,
                                    movement:
                                        (rest.movement as MovementType) ??
                                        MovementType.AUTOMATIC,

                                    length:
                                        rest.length != null
                                            ? Number(rest.length)
                                            : undefined,
                                    width:
                                        rest.width != null
                                            ? Number(rest.width)
                                            : undefined,
                                    thickness:
                                        rest.thickness != null
                                            ? Number(rest.thickness)
                                            : undefined,
                                    ...(compConnect ? { complication: compConnect } : {}),


                                }) as Prisma.WatchSpecCreateWithoutProductInput,
                            },
                        } as Prisma.WatchSpecUpdateOneWithoutProductNestedInput)
                        : undefined,


            },
            select: { id: true },
        });

        // 2) Update giá/stock cho biến thể hiện có (nếu có gửi)
        if (price != null || stockQty != null) {
            await tx.productVariant.updateMany({
                where: { productId: id },
                data: clean({
                    price: price != null ? Number(price) : undefined,
                    stockQty: stockQty != null ? Number(stockQty) : undefined,
                }),
            });
        }

        // 3) Đồng bộ ảnh: chiến lược đơn giản là replace
        if (image) {
            await tx.productImage.deleteMany({ where: { productId: id } });
            if (image.length) {
                await tx.productImage.createMany({
                    data: image.map((im, i) => ({
                        productId: id,
                        fileKey: im.fileKey,
                        alt: im.alt ?? null,
                        sortOrder: im.sortOrder ?? i,
                    })),
                });
                // set primary từ ảnh đầu
                await tx.product.update({
                    where: { id },
                    data: { primaryImageUrl: image[0].fileKey },
                });
            } else {
                await tx.product.update({
                    where: { id },
                    data: { primaryImageUrl: null },
                });
            }
        }

        return updated;
    });
}
{/*} export async function createAdminProduct(
    tx: Prisma.TransactionClient,
    data: {
        title: string;
        status: string;
        type: ProductType | string;
        brandId?: string;
        vendorId?: string;
        variant: { price?: number; stockQty?: number };
        watchSpec?: { caseType?: string; length?: number; width?: number; thickness?: number };
        gender?: string;
        length?: string;
        movement?: string;
    }
) {

    const { brandId, vendorId, title, status, gender, movement, caseType, type, price, seoTitle, primaryImageUrl, seoDescription } = data;
    const createData: Prisma.ProductCreateInput = {
        title,
        status,
        type,
        seoTitle,
        seoDescription,
        ...(brandId ? { brand: { connect: { id: brandId } } } : {}),
        variants: {
            create: [
                {
                    price,
                    stockQty: 1,
                    isActive: true
                }
            ]
        },
        watchSpec: {
            create: {
                caseType,
                movement,          // optional vì có @default
                gender,            // optional vì có @default
                category: [],      // khuyến nghị
                length: 46.5,      // ✅ BẮT BUỘC
                width: 39.7,       // ✅ BẮT BUỘC
                thickness: 12.0,   // ✅ BẮT BUỘC
            }

        },
        ...(vendorId ? { vendor: { connect: { id: vendorId } } } : {}),
        primaryImageUrl: primaryImageUrl ?? null,
    };
    return prisma.product.create({
        data: createData,
        select: { id: true, slug: true },
    });
*/}
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { OrderItemIncludeObjectSchema as OrderItemIncludeObjectSchema } from './objects/OrderItemInclude.schema';
import { OrderItemOrderByWithRelationInputObjectSchema as OrderItemOrderByWithRelationInputObjectSchema } from './objects/OrderItemOrderByWithRelationInput.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './objects/OrderItemWhereInput.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './objects/OrderItemWhereUniqueInput.schema';
import { OrderItemScalarFieldEnumSchema } from './enums/OrderItemScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const OrderItemFindFirstOrThrowSelectSchema: z.ZodType<Prisma.OrderItemSelect> = z.object({
    id: z.boolean().optional(),
    orderId: z.boolean().optional(),
    productId: z.boolean().optional(),
    variantId: z.boolean().optional(),
    title: z.boolean().optional(),
    listPrice: z.boolean().optional(),
    discountType: z.boolean().optional(),
    discountValue: z.boolean().optional(),
    unitPriceAgreed: z.boolean().optional(),
    taxRate: z.boolean().optional(),
    quantity: z.boolean().optional(),
    subtotal: z.boolean().optional(),
    img: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    productType: z.boolean().optional(),
    kind: z.boolean().optional(),
    serviceCatalogId: z.boolean().optional(),
    serviceScope: z.boolean().optional(),
    linkedOrderItemId: z.boolean().optional(),
    customerItemNote: z.boolean().optional(),
    createdFromFlow: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    previousSaleStage: z.boolean().optional(),
    previousServiceStage: z.boolean().optional(),
    previousStockStage: z.boolean().optional(),
    previousProductStatus: z.boolean().optional(),
    acquisitionItem: z.boolean().optional(),
    linkedOrderItem: z.boolean().optional(),
    childOrderItems: z.boolean().optional(),
    order: z.boolean().optional(),
    product: z.boolean().optional(),
    serviceCatalog: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.OrderItemSelect>;

export const OrderItemFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    orderId: z.boolean().optional(),
    productId: z.boolean().optional(),
    variantId: z.boolean().optional(),
    title: z.boolean().optional(),
    listPrice: z.boolean().optional(),
    discountType: z.boolean().optional(),
    discountValue: z.boolean().optional(),
    unitPriceAgreed: z.boolean().optional(),
    taxRate: z.boolean().optional(),
    quantity: z.boolean().optional(),
    subtotal: z.boolean().optional(),
    img: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    productType: z.boolean().optional(),
    kind: z.boolean().optional(),
    serviceCatalogId: z.boolean().optional(),
    serviceScope: z.boolean().optional(),
    linkedOrderItemId: z.boolean().optional(),
    customerItemNote: z.boolean().optional(),
    createdFromFlow: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    previousSaleStage: z.boolean().optional(),
    previousServiceStage: z.boolean().optional(),
    previousStockStage: z.boolean().optional(),
    previousProductStatus: z.boolean().optional(),
    acquisitionItem: z.boolean().optional(),
    linkedOrderItem: z.boolean().optional(),
    childOrderItems: z.boolean().optional(),
    order: z.boolean().optional(),
    product: z.boolean().optional(),
    serviceCatalog: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const OrderItemFindFirstOrThrowSchema: z.ZodType<Prisma.OrderItemFindFirstOrThrowArgs> = z.object({ select: OrderItemFindFirstOrThrowSelectSchema.optional(), include: OrderItemIncludeObjectSchema.optional(), orderBy: z.union([OrderItemOrderByWithRelationInputObjectSchema, OrderItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderItemWhereInputObjectSchema.optional(), cursor: OrderItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([OrderItemScalarFieldEnumSchema, OrderItemScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.OrderItemFindFirstOrThrowArgs>;

export const OrderItemFindFirstOrThrowZodSchema = z.object({ select: OrderItemFindFirstOrThrowSelectSchema.optional(), include: OrderItemIncludeObjectSchema.optional(), orderBy: z.union([OrderItemOrderByWithRelationInputObjectSchema, OrderItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderItemWhereInputObjectSchema.optional(), cursor: OrderItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([OrderItemScalarFieldEnumSchema, OrderItemScalarFieldEnumSchema.array()]).optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { OrderItemIncludeObjectSchema as OrderItemIncludeObjectSchema } from './objects/OrderItemInclude.schema';
import { OrderItemOrderByWithRelationInputObjectSchema as OrderItemOrderByWithRelationInputObjectSchema } from './objects/OrderItemOrderByWithRelationInput.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './objects/OrderItemWhereInput.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './objects/OrderItemWhereUniqueInput.schema';
import { OrderItemScalarFieldEnumSchema } from './enums/OrderItemScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const OrderItemFindManySelectSchema: z.ZodType<Prisma.OrderItemSelect> = z.object({
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
    acquisitionItem: z.boolean().optional(),
    OrderItem: z.boolean().optional(),
    other_OrderItem: z.boolean().optional(),
    order: z.boolean().optional(),
    Product: z.boolean().optional(),
    ServiceCatalog: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.OrderItemSelect>;

export const OrderItemFindManySelectZodSchema = z.object({
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
    acquisitionItem: z.boolean().optional(),
    OrderItem: z.boolean().optional(),
    other_OrderItem: z.boolean().optional(),
    order: z.boolean().optional(),
    Product: z.boolean().optional(),
    ServiceCatalog: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const OrderItemFindManySchema: z.ZodType<Prisma.OrderItemFindManyArgs> = z.object({ select: OrderItemFindManySelectSchema.optional(), include: OrderItemIncludeObjectSchema.optional(), orderBy: z.union([OrderItemOrderByWithRelationInputObjectSchema, OrderItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderItemWhereInputObjectSchema.optional(), cursor: OrderItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([OrderItemScalarFieldEnumSchema, OrderItemScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.OrderItemFindManyArgs>;

export const OrderItemFindManyZodSchema = z.object({ select: OrderItemFindManySelectSchema.optional(), include: OrderItemIncludeObjectSchema.optional(), orderBy: z.union([OrderItemOrderByWithRelationInputObjectSchema, OrderItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderItemWhereInputObjectSchema.optional(), cursor: OrderItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([OrderItemScalarFieldEnumSchema, OrderItemScalarFieldEnumSchema.array()]).optional() }).strict();
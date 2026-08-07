import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestItemIncludeObjectSchema as PurchaseRequestItemIncludeObjectSchema } from './objects/PurchaseRequestItemInclude.schema';
import { PurchaseRequestItemOrderByWithRelationInputObjectSchema as PurchaseRequestItemOrderByWithRelationInputObjectSchema } from './objects/PurchaseRequestItemOrderByWithRelationInput.schema';
import { PurchaseRequestItemWhereInputObjectSchema as PurchaseRequestItemWhereInputObjectSchema } from './objects/PurchaseRequestItemWhereInput.schema';
import { PurchaseRequestItemWhereUniqueInputObjectSchema as PurchaseRequestItemWhereUniqueInputObjectSchema } from './objects/PurchaseRequestItemWhereUniqueInput.schema';
import { PurchaseRequestItemScalarFieldEnumSchema } from './enums/PurchaseRequestItemScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const PurchaseRequestItemFindFirstOrThrowSelectSchema: z.ZodType<Prisma.PurchaseRequestItemSelect> = z.object({
    id: z.boolean().optional(),
    purchaseRequestId: z.boolean().optional(),
    productId: z.boolean().optional(),
    titleSnapshot: z.boolean().optional(),
    listPriceSnapshot: z.boolean().optional(),
    quantity: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    purchaseRequest: z.boolean().optional(),
    product: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestItemSelect>;

export const PurchaseRequestItemFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    purchaseRequestId: z.boolean().optional(),
    productId: z.boolean().optional(),
    titleSnapshot: z.boolean().optional(),
    listPriceSnapshot: z.boolean().optional(),
    quantity: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    purchaseRequest: z.boolean().optional(),
    product: z.boolean().optional()
  }).strict();

export const PurchaseRequestItemFindFirstOrThrowSchema: z.ZodType<Prisma.PurchaseRequestItemFindFirstOrThrowArgs> = z.object({ select: PurchaseRequestItemFindFirstOrThrowSelectSchema.optional(), include: PurchaseRequestItemIncludeObjectSchema.optional(), orderBy: z.union([PurchaseRequestItemOrderByWithRelationInputObjectSchema, PurchaseRequestItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: PurchaseRequestItemWhereInputObjectSchema.optional(), cursor: PurchaseRequestItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PurchaseRequestItemScalarFieldEnumSchema, PurchaseRequestItemScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestItemFindFirstOrThrowArgs>;

export const PurchaseRequestItemFindFirstOrThrowZodSchema = z.object({ select: PurchaseRequestItemFindFirstOrThrowSelectSchema.optional(), include: PurchaseRequestItemIncludeObjectSchema.optional(), orderBy: z.union([PurchaseRequestItemOrderByWithRelationInputObjectSchema, PurchaseRequestItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: PurchaseRequestItemWhereInputObjectSchema.optional(), cursor: PurchaseRequestItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PurchaseRequestItemScalarFieldEnumSchema, PurchaseRequestItemScalarFieldEnumSchema.array()]).optional() }).strict();
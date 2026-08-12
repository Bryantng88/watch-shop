import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestIngressReceiptIncludeObjectSchema as PurchaseRequestIngressReceiptIncludeObjectSchema } from './objects/PurchaseRequestIngressReceiptInclude.schema';
import { PurchaseRequestIngressReceiptOrderByWithRelationInputObjectSchema as PurchaseRequestIngressReceiptOrderByWithRelationInputObjectSchema } from './objects/PurchaseRequestIngressReceiptOrderByWithRelationInput.schema';
import { PurchaseRequestIngressReceiptWhereInputObjectSchema as PurchaseRequestIngressReceiptWhereInputObjectSchema } from './objects/PurchaseRequestIngressReceiptWhereInput.schema';
import { PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema as PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema } from './objects/PurchaseRequestIngressReceiptWhereUniqueInput.schema';
import { PurchaseRequestIngressReceiptScalarFieldEnumSchema } from './enums/PurchaseRequestIngressReceiptScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const PurchaseRequestIngressReceiptFindFirstSelectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptSelect> = z.object({
    id: z.boolean().optional(),
    requestKey: z.boolean().optional(),
    requestHash: z.boolean().optional(),
    purchaseRequestId: z.boolean().optional(),
    disposition: z.boolean().optional(),
    addedItemCount: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    purchaseRequest: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptSelect>;

export const PurchaseRequestIngressReceiptFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    requestKey: z.boolean().optional(),
    requestHash: z.boolean().optional(),
    purchaseRequestId: z.boolean().optional(),
    disposition: z.boolean().optional(),
    addedItemCount: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    purchaseRequest: z.boolean().optional()
  }).strict();

export const PurchaseRequestIngressReceiptFindFirstSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptFindFirstArgs> = z.object({ select: PurchaseRequestIngressReceiptFindFirstSelectSchema.optional(), include: PurchaseRequestIngressReceiptIncludeObjectSchema.optional(), orderBy: z.union([PurchaseRequestIngressReceiptOrderByWithRelationInputObjectSchema, PurchaseRequestIngressReceiptOrderByWithRelationInputObjectSchema.array()]).optional(), where: PurchaseRequestIngressReceiptWhereInputObjectSchema.optional(), cursor: PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PurchaseRequestIngressReceiptScalarFieldEnumSchema, PurchaseRequestIngressReceiptScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptFindFirstArgs>;

export const PurchaseRequestIngressReceiptFindFirstZodSchema = z.object({ select: PurchaseRequestIngressReceiptFindFirstSelectSchema.optional(), include: PurchaseRequestIngressReceiptIncludeObjectSchema.optional(), orderBy: z.union([PurchaseRequestIngressReceiptOrderByWithRelationInputObjectSchema, PurchaseRequestIngressReceiptOrderByWithRelationInputObjectSchema.array()]).optional(), where: PurchaseRequestIngressReceiptWhereInputObjectSchema.optional(), cursor: PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PurchaseRequestIngressReceiptScalarFieldEnumSchema, PurchaseRequestIngressReceiptScalarFieldEnumSchema.array()]).optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestActivityIncludeObjectSchema as PurchaseRequestActivityIncludeObjectSchema } from './objects/PurchaseRequestActivityInclude.schema';
import { PurchaseRequestActivityOrderByWithRelationInputObjectSchema as PurchaseRequestActivityOrderByWithRelationInputObjectSchema } from './objects/PurchaseRequestActivityOrderByWithRelationInput.schema';
import { PurchaseRequestActivityWhereInputObjectSchema as PurchaseRequestActivityWhereInputObjectSchema } from './objects/PurchaseRequestActivityWhereInput.schema';
import { PurchaseRequestActivityWhereUniqueInputObjectSchema as PurchaseRequestActivityWhereUniqueInputObjectSchema } from './objects/PurchaseRequestActivityWhereUniqueInput.schema';
import { PurchaseRequestActivityScalarFieldEnumSchema } from './enums/PurchaseRequestActivityScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const PurchaseRequestActivityFindFirstSelectSchema: z.ZodType<Prisma.PurchaseRequestActivitySelect> = z.object({
    id: z.boolean().optional(),
    purchaseRequestId: z.boolean().optional(),
    type: z.boolean().optional(),
    note: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    followUpAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    purchaseRequest: z.boolean().optional(),
    actor: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestActivitySelect>;

export const PurchaseRequestActivityFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    purchaseRequestId: z.boolean().optional(),
    type: z.boolean().optional(),
    note: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    followUpAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    purchaseRequest: z.boolean().optional(),
    actor: z.boolean().optional()
  }).strict();

export const PurchaseRequestActivityFindFirstSchema: z.ZodType<Prisma.PurchaseRequestActivityFindFirstArgs> = z.object({ select: PurchaseRequestActivityFindFirstSelectSchema.optional(), include: PurchaseRequestActivityIncludeObjectSchema.optional(), orderBy: z.union([PurchaseRequestActivityOrderByWithRelationInputObjectSchema, PurchaseRequestActivityOrderByWithRelationInputObjectSchema.array()]).optional(), where: PurchaseRequestActivityWhereInputObjectSchema.optional(), cursor: PurchaseRequestActivityWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PurchaseRequestActivityScalarFieldEnumSchema, PurchaseRequestActivityScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestActivityFindFirstArgs>;

export const PurchaseRequestActivityFindFirstZodSchema = z.object({ select: PurchaseRequestActivityFindFirstSelectSchema.optional(), include: PurchaseRequestActivityIncludeObjectSchema.optional(), orderBy: z.union([PurchaseRequestActivityOrderByWithRelationInputObjectSchema, PurchaseRequestActivityOrderByWithRelationInputObjectSchema.array()]).optional(), where: PurchaseRequestActivityWhereInputObjectSchema.optional(), cursor: PurchaseRequestActivityWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PurchaseRequestActivityScalarFieldEnumSchema, PurchaseRequestActivityScalarFieldEnumSchema.array()]).optional() }).strict();
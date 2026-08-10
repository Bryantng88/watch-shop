import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestIncludeObjectSchema as PurchaseRequestIncludeObjectSchema } from './objects/PurchaseRequestInclude.schema';
import { PurchaseRequestOrderByWithRelationInputObjectSchema as PurchaseRequestOrderByWithRelationInputObjectSchema } from './objects/PurchaseRequestOrderByWithRelationInput.schema';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './objects/PurchaseRequestWhereInput.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './objects/PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestScalarFieldEnumSchema } from './enums/PurchaseRequestScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const PurchaseRequestFindFirstOrThrowSelectSchema: z.ZodType<Prisma.PurchaseRequestSelect> = z.object({
    id: z.boolean().optional(),
    reference: z.boolean().optional(),
    status: z.boolean().optional(),
    outcome: z.boolean().optional(),
    channel: z.boolean().optional(),
    externalRequestId: z.boolean().optional(),
    requestKey: z.boolean().optional(),
    requestHash: z.boolean().optional(),
    fingerprintHash: z.boolean().optional(),
    customerName: z.boolean().optional(),
    phone: z.boolean().optional(),
    contactPreference: z.boolean().optional(),
    address: z.boolean().optional(),
    city: z.boolean().optional(),
    district: z.boolean().optional(),
    ward: z.boolean().optional(),
    customerNote: z.boolean().optional(),
    processingNote: z.boolean().optional(),
    completionReason: z.boolean().optional(),
    assignedUserId: z.boolean().optional(),
    followUpAt: z.boolean().optional(),
    processingStartedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    orderId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    items: z.boolean().optional(),
    activities: z.boolean().optional(),
    order: z.boolean().optional(),
    assignedUser: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestSelect>;

export const PurchaseRequestFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    reference: z.boolean().optional(),
    status: z.boolean().optional(),
    outcome: z.boolean().optional(),
    channel: z.boolean().optional(),
    externalRequestId: z.boolean().optional(),
    requestKey: z.boolean().optional(),
    requestHash: z.boolean().optional(),
    fingerprintHash: z.boolean().optional(),
    customerName: z.boolean().optional(),
    phone: z.boolean().optional(),
    contactPreference: z.boolean().optional(),
    address: z.boolean().optional(),
    city: z.boolean().optional(),
    district: z.boolean().optional(),
    ward: z.boolean().optional(),
    customerNote: z.boolean().optional(),
    processingNote: z.boolean().optional(),
    completionReason: z.boolean().optional(),
    assignedUserId: z.boolean().optional(),
    followUpAt: z.boolean().optional(),
    processingStartedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    orderId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    items: z.boolean().optional(),
    activities: z.boolean().optional(),
    order: z.boolean().optional(),
    assignedUser: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const PurchaseRequestFindFirstOrThrowSchema: z.ZodType<Prisma.PurchaseRequestFindFirstOrThrowArgs> = z.object({ select: PurchaseRequestFindFirstOrThrowSelectSchema.optional(), include: PurchaseRequestIncludeObjectSchema.optional(), orderBy: z.union([PurchaseRequestOrderByWithRelationInputObjectSchema, PurchaseRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: PurchaseRequestWhereInputObjectSchema.optional(), cursor: PurchaseRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PurchaseRequestScalarFieldEnumSchema, PurchaseRequestScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestFindFirstOrThrowArgs>;

export const PurchaseRequestFindFirstOrThrowZodSchema = z.object({ select: PurchaseRequestFindFirstOrThrowSelectSchema.optional(), include: PurchaseRequestIncludeObjectSchema.optional(), orderBy: z.union([PurchaseRequestOrderByWithRelationInputObjectSchema, PurchaseRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: PurchaseRequestWhereInputObjectSchema.optional(), cursor: PurchaseRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PurchaseRequestScalarFieldEnumSchema, PurchaseRequestScalarFieldEnumSchema.array()]).optional() }).strict();
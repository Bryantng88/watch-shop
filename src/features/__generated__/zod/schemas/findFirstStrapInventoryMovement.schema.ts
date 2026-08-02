import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapInventoryMovementIncludeObjectSchema as StrapInventoryMovementIncludeObjectSchema } from './objects/StrapInventoryMovementInclude.schema';
import { StrapInventoryMovementOrderByWithRelationInputObjectSchema as StrapInventoryMovementOrderByWithRelationInputObjectSchema } from './objects/StrapInventoryMovementOrderByWithRelationInput.schema';
import { StrapInventoryMovementWhereInputObjectSchema as StrapInventoryMovementWhereInputObjectSchema } from './objects/StrapInventoryMovementWhereInput.schema';
import { StrapInventoryMovementWhereUniqueInputObjectSchema as StrapInventoryMovementWhereUniqueInputObjectSchema } from './objects/StrapInventoryMovementWhereUniqueInput.schema';
import { StrapInventoryMovementScalarFieldEnumSchema } from './enums/StrapInventoryMovementScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const StrapInventoryMovementFindFirstSelectSchema: z.ZodType<Prisma.StrapInventoryMovementSelect> = z.object({
    id: z.boolean().optional(),
    strapVariantId: z.boolean().optional(),
    movementType: z.boolean().optional(),
    quantity: z.boolean().optional(),
    balanceAfter: z.boolean().optional(),
    watchId: z.boolean().optional(),
    orderId: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    sourceType: z.boolean().optional(),
    sourceId: z.boolean().optional(),
    note: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    strapVariant: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.StrapInventoryMovementSelect>;

export const StrapInventoryMovementFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    strapVariantId: z.boolean().optional(),
    movementType: z.boolean().optional(),
    quantity: z.boolean().optional(),
    balanceAfter: z.boolean().optional(),
    watchId: z.boolean().optional(),
    orderId: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    sourceType: z.boolean().optional(),
    sourceId: z.boolean().optional(),
    note: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    strapVariant: z.boolean().optional()
  }).strict();

export const StrapInventoryMovementFindFirstSchema: z.ZodType<Prisma.StrapInventoryMovementFindFirstArgs> = z.object({ select: StrapInventoryMovementFindFirstSelectSchema.optional(), include: StrapInventoryMovementIncludeObjectSchema.optional(), orderBy: z.union([StrapInventoryMovementOrderByWithRelationInputObjectSchema, StrapInventoryMovementOrderByWithRelationInputObjectSchema.array()]).optional(), where: StrapInventoryMovementWhereInputObjectSchema.optional(), cursor: StrapInventoryMovementWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([StrapInventoryMovementScalarFieldEnumSchema, StrapInventoryMovementScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.StrapInventoryMovementFindFirstArgs>;

export const StrapInventoryMovementFindFirstZodSchema = z.object({ select: StrapInventoryMovementFindFirstSelectSchema.optional(), include: StrapInventoryMovementIncludeObjectSchema.optional(), orderBy: z.union([StrapInventoryMovementOrderByWithRelationInputObjectSchema, StrapInventoryMovementOrderByWithRelationInputObjectSchema.array()]).optional(), where: StrapInventoryMovementWhereInputObjectSchema.optional(), cursor: StrapInventoryMovementWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([StrapInventoryMovementScalarFieldEnumSchema, StrapInventoryMovementScalarFieldEnumSchema.array()]).optional() }).strict();
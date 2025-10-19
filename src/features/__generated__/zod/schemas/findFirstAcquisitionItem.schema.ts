import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionItemIncludeObjectSchema as AcquisitionItemIncludeObjectSchema } from './objects/AcquisitionItemInclude.schema';
import { AcquisitionItemOrderByWithRelationInputObjectSchema as AcquisitionItemOrderByWithRelationInputObjectSchema } from './objects/AcquisitionItemOrderByWithRelationInput.schema';
import { AcquisitionItemWhereInputObjectSchema as AcquisitionItemWhereInputObjectSchema } from './objects/AcquisitionItemWhereInput.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './objects/AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemScalarFieldEnumSchema } from './enums/AcquisitionItemScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AcquisitionItemFindFirstSelectSchema: z.ZodType<Prisma.AcquisitionItemSelect> = z.object({
    id: z.boolean().optional(),
    acquisitionId: z.boolean().optional(),
    productId: z.boolean().optional(),
    variantId: z.boolean().optional(),
    quantity: z.boolean().optional(),
    unitCost: z.boolean().optional(),
    currency: z.boolean().optional(),
    notes: z.boolean().optional(),
    sourceOrderItemId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    acquisition: z.boolean().optional(),
    product: z.boolean().optional(),
    sourceOrderItem: z.boolean().optional(),
    variant: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemSelect>;

export const AcquisitionItemFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    acquisitionId: z.boolean().optional(),
    productId: z.boolean().optional(),
    variantId: z.boolean().optional(),
    quantity: z.boolean().optional(),
    unitCost: z.boolean().optional(),
    currency: z.boolean().optional(),
    notes: z.boolean().optional(),
    sourceOrderItemId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    acquisition: z.boolean().optional(),
    product: z.boolean().optional(),
    sourceOrderItem: z.boolean().optional(),
    variant: z.boolean().optional()
  }).strict();

export const AcquisitionItemFindFirstSchema: z.ZodType<Prisma.AcquisitionItemFindFirstArgs> = z.object({ select: AcquisitionItemFindFirstSelectSchema.optional(), include: AcquisitionItemIncludeObjectSchema.optional(), orderBy: z.union([AcquisitionItemOrderByWithRelationInputObjectSchema, AcquisitionItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcquisitionItemWhereInputObjectSchema.optional(), cursor: AcquisitionItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AcquisitionItemScalarFieldEnumSchema, AcquisitionItemScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemFindFirstArgs>;

export const AcquisitionItemFindFirstZodSchema = z.object({ select: AcquisitionItemFindFirstSelectSchema.optional(), include: AcquisitionItemIncludeObjectSchema.optional(), orderBy: z.union([AcquisitionItemOrderByWithRelationInputObjectSchema, AcquisitionItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcquisitionItemWhereInputObjectSchema.optional(), cursor: AcquisitionItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AcquisitionItemScalarFieldEnumSchema, AcquisitionItemScalarFieldEnumSchema.array()]).optional() }).strict();
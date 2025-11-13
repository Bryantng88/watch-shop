import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionItemIncludeObjectSchema as AcquisitionItemIncludeObjectSchema } from './objects/AcquisitionItemInclude.schema';
import { AcquisitionItemOrderByWithRelationInputObjectSchema as AcquisitionItemOrderByWithRelationInputObjectSchema } from './objects/AcquisitionItemOrderByWithRelationInput.schema';
import { AcquisitionItemWhereInputObjectSchema as AcquisitionItemWhereInputObjectSchema } from './objects/AcquisitionItemWhereInput.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './objects/AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemScalarFieldEnumSchema } from './enums/AcquisitionItemScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AcquisitionItemFindManySelectSchema: z.ZodType<Prisma.AcquisitionItemSelect> = z.object({
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
    kind: z.boolean().optional(),
    status: z.boolean().optional(),
    description: z.boolean().optional(),
    expectedReturnAt: z.boolean().optional(),
    returnedAt: z.boolean().optional(),
    vendorRmaNo: z.boolean().optional(),
    warrantyMonths: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    capitalizeToProduct: z.boolean().optional(),
    acquisition: z.boolean().optional(),
    product: z.boolean().optional(),
    sourceOrderItem: z.boolean().optional(),
    variant: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemSelect>;

export const AcquisitionItemFindManySelectZodSchema = z.object({
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
    kind: z.boolean().optional(),
    status: z.boolean().optional(),
    description: z.boolean().optional(),
    expectedReturnAt: z.boolean().optional(),
    returnedAt: z.boolean().optional(),
    vendorRmaNo: z.boolean().optional(),
    warrantyMonths: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    capitalizeToProduct: z.boolean().optional(),
    acquisition: z.boolean().optional(),
    product: z.boolean().optional(),
    sourceOrderItem: z.boolean().optional(),
    variant: z.boolean().optional()
  }).strict();

export const AcquisitionItemFindManySchema: z.ZodType<Prisma.AcquisitionItemFindManyArgs> = z.object({ select: AcquisitionItemFindManySelectSchema.optional(), include: AcquisitionItemIncludeObjectSchema.optional(), orderBy: z.union([AcquisitionItemOrderByWithRelationInputObjectSchema, AcquisitionItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcquisitionItemWhereInputObjectSchema.optional(), cursor: AcquisitionItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AcquisitionItemScalarFieldEnumSchema, AcquisitionItemScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemFindManyArgs>;

export const AcquisitionItemFindManyZodSchema = z.object({ select: AcquisitionItemFindManySelectSchema.optional(), include: AcquisitionItemIncludeObjectSchema.optional(), orderBy: z.union([AcquisitionItemOrderByWithRelationInputObjectSchema, AcquisitionItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcquisitionItemWhereInputObjectSchema.optional(), cursor: AcquisitionItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AcquisitionItemScalarFieldEnumSchema, AcquisitionItemScalarFieldEnumSchema.array()]).optional() }).strict();
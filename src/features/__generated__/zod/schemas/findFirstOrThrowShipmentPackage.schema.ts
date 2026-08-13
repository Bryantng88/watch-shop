import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentPackageIncludeObjectSchema as ShipmentPackageIncludeObjectSchema } from './objects/ShipmentPackageInclude.schema';
import { ShipmentPackageOrderByWithRelationInputObjectSchema as ShipmentPackageOrderByWithRelationInputObjectSchema } from './objects/ShipmentPackageOrderByWithRelationInput.schema';
import { ShipmentPackageWhereInputObjectSchema as ShipmentPackageWhereInputObjectSchema } from './objects/ShipmentPackageWhereInput.schema';
import { ShipmentPackageWhereUniqueInputObjectSchema as ShipmentPackageWhereUniqueInputObjectSchema } from './objects/ShipmentPackageWhereUniqueInput.schema';
import { ShipmentPackageScalarFieldEnumSchema } from './enums/ShipmentPackageScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ShipmentPackageFindFirstOrThrowSelectSchema: z.ZodType<Prisma.ShipmentPackageSelect> = z.object({
    id: z.boolean().optional(),
    shipmentId: z.boolean().optional(),
    weightGram: z.boolean().optional(),
    lengthCm: z.boolean().optional(),
    widthCm: z.boolean().optional(),
    heightCm: z.boolean().optional(),
    itemCount: z.boolean().optional(),
    declaredValue: z.boolean().optional(),
    contentDescription: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    shipment: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ShipmentPackageSelect>;

export const ShipmentPackageFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    shipmentId: z.boolean().optional(),
    weightGram: z.boolean().optional(),
    lengthCm: z.boolean().optional(),
    widthCm: z.boolean().optional(),
    heightCm: z.boolean().optional(),
    itemCount: z.boolean().optional(),
    declaredValue: z.boolean().optional(),
    contentDescription: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    shipment: z.boolean().optional()
  }).strict();

export const ShipmentPackageFindFirstOrThrowSchema: z.ZodType<Prisma.ShipmentPackageFindFirstOrThrowArgs> = z.object({ select: ShipmentPackageFindFirstOrThrowSelectSchema.optional(), include: ShipmentPackageIncludeObjectSchema.optional(), orderBy: z.union([ShipmentPackageOrderByWithRelationInputObjectSchema, ShipmentPackageOrderByWithRelationInputObjectSchema.array()]).optional(), where: ShipmentPackageWhereInputObjectSchema.optional(), cursor: ShipmentPackageWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ShipmentPackageScalarFieldEnumSchema, ShipmentPackageScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ShipmentPackageFindFirstOrThrowArgs>;

export const ShipmentPackageFindFirstOrThrowZodSchema = z.object({ select: ShipmentPackageFindFirstOrThrowSelectSchema.optional(), include: ShipmentPackageIncludeObjectSchema.optional(), orderBy: z.union([ShipmentPackageOrderByWithRelationInputObjectSchema, ShipmentPackageOrderByWithRelationInputObjectSchema.array()]).optional(), where: ShipmentPackageWhereInputObjectSchema.optional(), cursor: ShipmentPackageWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ShipmentPackageScalarFieldEnumSchema, ShipmentPackageScalarFieldEnumSchema.array()]).optional() }).strict();
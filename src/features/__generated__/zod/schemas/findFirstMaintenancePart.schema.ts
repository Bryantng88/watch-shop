import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenancePartIncludeObjectSchema as MaintenancePartIncludeObjectSchema } from './objects/MaintenancePartInclude.schema';
import { MaintenancePartOrderByWithRelationInputObjectSchema as MaintenancePartOrderByWithRelationInputObjectSchema } from './objects/MaintenancePartOrderByWithRelationInput.schema';
import { MaintenancePartWhereInputObjectSchema as MaintenancePartWhereInputObjectSchema } from './objects/MaintenancePartWhereInput.schema';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './objects/MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartScalarFieldEnumSchema } from './enums/MaintenancePartScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const MaintenancePartFindFirstSelectSchema: z.ZodType<Prisma.MaintenancePartSelect> = z.object({
    id: z.boolean().optional(),
    recordId: z.boolean().optional(),
    variantId: z.boolean().optional(),
    name: z.boolean().optional(),
    quantity: z.boolean().optional(),
    unitCost: z.boolean().optional(),
    notes: z.boolean().optional(),
    record: z.boolean().optional(),
    variant: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.MaintenancePartSelect>;

export const MaintenancePartFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    recordId: z.boolean().optional(),
    variantId: z.boolean().optional(),
    name: z.boolean().optional(),
    quantity: z.boolean().optional(),
    unitCost: z.boolean().optional(),
    notes: z.boolean().optional(),
    record: z.boolean().optional(),
    variant: z.boolean().optional()
  }).strict();

export const MaintenancePartFindFirstSchema: z.ZodType<Prisma.MaintenancePartFindFirstArgs> = z.object({ select: MaintenancePartFindFirstSelectSchema.optional(), include: MaintenancePartIncludeObjectSchema.optional(), orderBy: z.union([MaintenancePartOrderByWithRelationInputObjectSchema, MaintenancePartOrderByWithRelationInputObjectSchema.array()]).optional(), where: MaintenancePartWhereInputObjectSchema.optional(), cursor: MaintenancePartWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MaintenancePartScalarFieldEnumSchema, MaintenancePartScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.MaintenancePartFindFirstArgs>;

export const MaintenancePartFindFirstZodSchema = z.object({ select: MaintenancePartFindFirstSelectSchema.optional(), include: MaintenancePartIncludeObjectSchema.optional(), orderBy: z.union([MaintenancePartOrderByWithRelationInputObjectSchema, MaintenancePartOrderByWithRelationInputObjectSchema.array()]).optional(), where: MaintenancePartWhereInputObjectSchema.optional(), cursor: MaintenancePartWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MaintenancePartScalarFieldEnumSchema, MaintenancePartScalarFieldEnumSchema.array()]).optional() }).strict();
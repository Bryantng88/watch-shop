import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobIncludeObjectSchema as AcquisitionSpecJobIncludeObjectSchema } from './objects/AcquisitionSpecJobInclude.schema';
import { AcquisitionSpecJobOrderByWithRelationInputObjectSchema as AcquisitionSpecJobOrderByWithRelationInputObjectSchema } from './objects/AcquisitionSpecJobOrderByWithRelationInput.schema';
import { AcquisitionSpecJobWhereInputObjectSchema as AcquisitionSpecJobWhereInputObjectSchema } from './objects/AcquisitionSpecJobWhereInput.schema';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './objects/AcquisitionSpecJobWhereUniqueInput.schema';
import { AcquisitionSpecJobScalarFieldEnumSchema } from './enums/AcquisitionSpecJobScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AcquisitionSpecJobFindFirstSelectSchema: z.ZodType<Prisma.AcquisitionSpecJobSelect> = z.object({
    id: z.boolean().optional(),
    acquisitionItemId: z.boolean().optional(),
    productId: z.boolean().optional(),
    status: z.boolean().optional(),
    attempts: z.boolean().optional(),
    lastError: z.boolean().optional(),
    startedAt: z.boolean().optional(),
    finishedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    runAfter: z.boolean().optional(),
    priority: z.boolean().optional(),
    acquisitionItem: z.boolean().optional(),
    Product: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobSelect>;

export const AcquisitionSpecJobFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    acquisitionItemId: z.boolean().optional(),
    productId: z.boolean().optional(),
    status: z.boolean().optional(),
    attempts: z.boolean().optional(),
    lastError: z.boolean().optional(),
    startedAt: z.boolean().optional(),
    finishedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    runAfter: z.boolean().optional(),
    priority: z.boolean().optional(),
    acquisitionItem: z.boolean().optional(),
    Product: z.boolean().optional()
  }).strict();

export const AcquisitionSpecJobFindFirstSchema: z.ZodType<Prisma.AcquisitionSpecJobFindFirstArgs> = z.object({ select: AcquisitionSpecJobFindFirstSelectSchema.optional(), include: AcquisitionSpecJobIncludeObjectSchema.optional(), orderBy: z.union([AcquisitionSpecJobOrderByWithRelationInputObjectSchema, AcquisitionSpecJobOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcquisitionSpecJobWhereInputObjectSchema.optional(), cursor: AcquisitionSpecJobWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AcquisitionSpecJobScalarFieldEnumSchema, AcquisitionSpecJobScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobFindFirstArgs>;

export const AcquisitionSpecJobFindFirstZodSchema = z.object({ select: AcquisitionSpecJobFindFirstSelectSchema.optional(), include: AcquisitionSpecJobIncludeObjectSchema.optional(), orderBy: z.union([AcquisitionSpecJobOrderByWithRelationInputObjectSchema, AcquisitionSpecJobOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcquisitionSpecJobWhereInputObjectSchema.optional(), cursor: AcquisitionSpecJobWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AcquisitionSpecJobScalarFieldEnumSchema, AcquisitionSpecJobScalarFieldEnumSchema.array()]).optional() }).strict();
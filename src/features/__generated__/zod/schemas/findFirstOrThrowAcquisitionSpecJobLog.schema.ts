import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobLogIncludeObjectSchema as AcquisitionSpecJobLogIncludeObjectSchema } from './objects/AcquisitionSpecJobLogInclude.schema';
import { AcquisitionSpecJobLogOrderByWithRelationInputObjectSchema as AcquisitionSpecJobLogOrderByWithRelationInputObjectSchema } from './objects/AcquisitionSpecJobLogOrderByWithRelationInput.schema';
import { AcquisitionSpecJobLogWhereInputObjectSchema as AcquisitionSpecJobLogWhereInputObjectSchema } from './objects/AcquisitionSpecJobLogWhereInput.schema';
import { AcquisitionSpecJobLogWhereUniqueInputObjectSchema as AcquisitionSpecJobLogWhereUniqueInputObjectSchema } from './objects/AcquisitionSpecJobLogWhereUniqueInput.schema';
import { AcquisitionSpecJobLogScalarFieldEnumSchema } from './enums/AcquisitionSpecJobLogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AcquisitionSpecJobLogFindFirstOrThrowSelectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogSelect> = z.object({
    id: z.boolean().optional(),
    acquisitionSpecJobId: z.boolean().optional(),
    acquisitionItemId: z.boolean().optional(),
    acquisitionId: z.boolean().optional(),
    productId: z.boolean().optional(),
    stage: z.boolean().optional(),
    level: z.boolean().optional(),
    message: z.boolean().optional(),
    payload: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    acquisitionSpecJob: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogSelect>;

export const AcquisitionSpecJobLogFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    acquisitionSpecJobId: z.boolean().optional(),
    acquisitionItemId: z.boolean().optional(),
    acquisitionId: z.boolean().optional(),
    productId: z.boolean().optional(),
    stage: z.boolean().optional(),
    level: z.boolean().optional(),
    message: z.boolean().optional(),
    payload: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    acquisitionSpecJob: z.boolean().optional()
  }).strict();

export const AcquisitionSpecJobLogFindFirstOrThrowSchema: z.ZodType<Prisma.AcquisitionSpecJobLogFindFirstOrThrowArgs> = z.object({ select: AcquisitionSpecJobLogFindFirstOrThrowSelectSchema.optional(), include: AcquisitionSpecJobLogIncludeObjectSchema.optional(), orderBy: z.union([AcquisitionSpecJobLogOrderByWithRelationInputObjectSchema, AcquisitionSpecJobLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcquisitionSpecJobLogWhereInputObjectSchema.optional(), cursor: AcquisitionSpecJobLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AcquisitionSpecJobLogScalarFieldEnumSchema, AcquisitionSpecJobLogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogFindFirstOrThrowArgs>;

export const AcquisitionSpecJobLogFindFirstOrThrowZodSchema = z.object({ select: AcquisitionSpecJobLogFindFirstOrThrowSelectSchema.optional(), include: AcquisitionSpecJobLogIncludeObjectSchema.optional(), orderBy: z.union([AcquisitionSpecJobLogOrderByWithRelationInputObjectSchema, AcquisitionSpecJobLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcquisitionSpecJobLogWhereInputObjectSchema.optional(), cursor: AcquisitionSpecJobLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AcquisitionSpecJobLogScalarFieldEnumSchema, AcquisitionSpecJobLogScalarFieldEnumSchema.array()]).optional() }).strict();
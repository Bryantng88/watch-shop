import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ComplicationIncludeObjectSchema as ComplicationIncludeObjectSchema } from './objects/ComplicationInclude.schema';
import { ComplicationOrderByWithRelationInputObjectSchema as ComplicationOrderByWithRelationInputObjectSchema } from './objects/ComplicationOrderByWithRelationInput.schema';
import { ComplicationWhereInputObjectSchema as ComplicationWhereInputObjectSchema } from './objects/ComplicationWhereInput.schema';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './objects/ComplicationWhereUniqueInput.schema';
import { ComplicationScalarFieldEnumSchema } from './enums/ComplicationScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ComplicationFindFirstSelectSchema: z.ZodType<Prisma.ComplicationSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    watchSpecs: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ComplicationSelect>;

export const ComplicationFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    watchSpecs: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ComplicationFindFirstSchema: z.ZodType<Prisma.ComplicationFindFirstArgs> = z.object({ select: ComplicationFindFirstSelectSchema.optional(), include: ComplicationIncludeObjectSchema.optional(), orderBy: z.union([ComplicationOrderByWithRelationInputObjectSchema, ComplicationOrderByWithRelationInputObjectSchema.array()]).optional(), where: ComplicationWhereInputObjectSchema.optional(), cursor: ComplicationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ComplicationScalarFieldEnumSchema, ComplicationScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ComplicationFindFirstArgs>;

export const ComplicationFindFirstZodSchema = z.object({ select: ComplicationFindFirstSelectSchema.optional(), include: ComplicationIncludeObjectSchema.optional(), orderBy: z.union([ComplicationOrderByWithRelationInputObjectSchema, ComplicationOrderByWithRelationInputObjectSchema.array()]).optional(), where: ComplicationWhereInputObjectSchema.optional(), cursor: ComplicationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ComplicationScalarFieldEnumSchema, ComplicationScalarFieldEnumSchema.array()]).optional() }).strict();
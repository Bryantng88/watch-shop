import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobControlOrderByWithRelationInputObjectSchema as SystemJobControlOrderByWithRelationInputObjectSchema } from './objects/SystemJobControlOrderByWithRelationInput.schema';
import { SystemJobControlWhereInputObjectSchema as SystemJobControlWhereInputObjectSchema } from './objects/SystemJobControlWhereInput.schema';
import { SystemJobControlWhereUniqueInputObjectSchema as SystemJobControlWhereUniqueInputObjectSchema } from './objects/SystemJobControlWhereUniqueInput.schema';
import { SystemJobControlScalarFieldEnumSchema } from './enums/SystemJobControlScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const SystemJobControlFindManySelectSchema: z.ZodType<Prisma.SystemJobControlSelect> = z.object({
    key: z.boolean().optional(),
    label: z.boolean().optional(),
    enabled: z.boolean().optional(),
    batchSize: z.boolean().optional(),
    pausedReason: z.boolean().optional(),
    metadata: z.boolean().optional(),
    updated_at: z.boolean().optional(),
    updated_by: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.SystemJobControlSelect>;

export const SystemJobControlFindManySelectZodSchema = z.object({
    key: z.boolean().optional(),
    label: z.boolean().optional(),
    enabled: z.boolean().optional(),
    batchSize: z.boolean().optional(),
    pausedReason: z.boolean().optional(),
    metadata: z.boolean().optional(),
    updated_at: z.boolean().optional(),
    updated_by: z.boolean().optional()
  }).strict();

export const SystemJobControlFindManySchema: z.ZodType<Prisma.SystemJobControlFindManyArgs> = z.object({ select: SystemJobControlFindManySelectSchema.optional(),  orderBy: z.union([SystemJobControlOrderByWithRelationInputObjectSchema, SystemJobControlOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemJobControlWhereInputObjectSchema.optional(), cursor: SystemJobControlWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemJobControlScalarFieldEnumSchema, SystemJobControlScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.SystemJobControlFindManyArgs>;

export const SystemJobControlFindManyZodSchema = z.object({ select: SystemJobControlFindManySelectSchema.optional(),  orderBy: z.union([SystemJobControlOrderByWithRelationInputObjectSchema, SystemJobControlOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemJobControlWhereInputObjectSchema.optional(), cursor: SystemJobControlWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemJobControlScalarFieldEnumSchema, SystemJobControlScalarFieldEnumSchema.array()]).optional() }).strict();
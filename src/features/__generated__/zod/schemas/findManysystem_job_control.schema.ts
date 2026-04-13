import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_controlOrderByWithRelationInputObjectSchema as system_job_controlOrderByWithRelationInputObjectSchema } from './objects/system_job_controlOrderByWithRelationInput.schema';
import { system_job_controlWhereInputObjectSchema as system_job_controlWhereInputObjectSchema } from './objects/system_job_controlWhereInput.schema';
import { system_job_controlWhereUniqueInputObjectSchema as system_job_controlWhereUniqueInputObjectSchema } from './objects/system_job_controlWhereUniqueInput.schema';
import { SystemJobControlScalarFieldEnumSchema } from './enums/SystemJobControlScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const system_job_controlFindManySelectSchema: z.ZodType<Prisma.system_job_controlSelect> = z.object({
    key: z.boolean().optional(),
    label: z.boolean().optional(),
    enabled: z.boolean().optional(),
    batch_size: z.boolean().optional(),
    paused_reason: z.boolean().optional(),
    metadata: z.boolean().optional(),
    updated_at: z.boolean().optional(),
    updated_by: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.system_job_controlSelect>;

export const system_job_controlFindManySelectZodSchema = z.object({
    key: z.boolean().optional(),
    label: z.boolean().optional(),
    enabled: z.boolean().optional(),
    batch_size: z.boolean().optional(),
    paused_reason: z.boolean().optional(),
    metadata: z.boolean().optional(),
    updated_at: z.boolean().optional(),
    updated_by: z.boolean().optional()
  }).strict();

export const system_job_controlFindManySchema: z.ZodType<Prisma.system_job_controlFindManyArgs> = z.object({ select: system_job_controlFindManySelectSchema.optional(),  orderBy: z.union([system_job_controlOrderByWithRelationInputObjectSchema, system_job_controlOrderByWithRelationInputObjectSchema.array()]).optional(), where: system_job_controlWhereInputObjectSchema.optional(), cursor: system_job_controlWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemJobControlScalarFieldEnumSchema, SystemJobControlScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.system_job_controlFindManyArgs>;

export const system_job_controlFindManyZodSchema = z.object({ select: system_job_controlFindManySelectSchema.optional(),  orderBy: z.union([system_job_controlOrderByWithRelationInputObjectSchema, system_job_controlOrderByWithRelationInputObjectSchema.array()]).optional(), where: system_job_controlWhereInputObjectSchema.optional(), cursor: system_job_controlWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemJobControlScalarFieldEnumSchema, SystemJobControlScalarFieldEnumSchema.array()]).optional() }).strict();
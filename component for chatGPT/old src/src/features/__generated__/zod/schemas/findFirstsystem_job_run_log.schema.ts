import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_run_logOrderByWithRelationInputObjectSchema as system_job_run_logOrderByWithRelationInputObjectSchema } from './objects/system_job_run_logOrderByWithRelationInput.schema';
import { system_job_run_logWhereInputObjectSchema as system_job_run_logWhereInputObjectSchema } from './objects/system_job_run_logWhereInput.schema';
import { system_job_run_logWhereUniqueInputObjectSchema as system_job_run_logWhereUniqueInputObjectSchema } from './objects/system_job_run_logWhereUniqueInput.schema';
import { SystemJobRunLogScalarFieldEnumSchema } from './enums/SystemJobRunLogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const system_job_run_logFindFirstSelectSchema: z.ZodType<Prisma.system_job_run_logSelect> = z.object({
    id: z.boolean().optional(),
    processor_key: z.boolean().optional(),
    trigger_source: z.boolean().optional(),
    status: z.boolean().optional(),
    processed_count: z.boolean().optional(),
    error_count: z.boolean().optional(),
    note: z.boolean().optional(),
    detail: z.boolean().optional(),
    started_at: z.boolean().optional(),
    finished_at: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.system_job_run_logSelect>;

export const system_job_run_logFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    processor_key: z.boolean().optional(),
    trigger_source: z.boolean().optional(),
    status: z.boolean().optional(),
    processed_count: z.boolean().optional(),
    error_count: z.boolean().optional(),
    note: z.boolean().optional(),
    detail: z.boolean().optional(),
    started_at: z.boolean().optional(),
    finished_at: z.boolean().optional()
  }).strict();

export const system_job_run_logFindFirstSchema: z.ZodType<Prisma.system_job_run_logFindFirstArgs> = z.object({ select: system_job_run_logFindFirstSelectSchema.optional(),  orderBy: z.union([system_job_run_logOrderByWithRelationInputObjectSchema, system_job_run_logOrderByWithRelationInputObjectSchema.array()]).optional(), where: system_job_run_logWhereInputObjectSchema.optional(), cursor: system_job_run_logWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemJobRunLogScalarFieldEnumSchema, SystemJobRunLogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.system_job_run_logFindFirstArgs>;

export const system_job_run_logFindFirstZodSchema = z.object({ select: system_job_run_logFindFirstSelectSchema.optional(),  orderBy: z.union([system_job_run_logOrderByWithRelationInputObjectSchema, system_job_run_logOrderByWithRelationInputObjectSchema.array()]).optional(), where: system_job_run_logWhereInputObjectSchema.optional(), cursor: system_job_run_logWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemJobRunLogScalarFieldEnumSchema, SystemJobRunLogScalarFieldEnumSchema.array()]).optional() }).strict();
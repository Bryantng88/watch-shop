import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_run_logSelectObjectSchema as system_job_run_logSelectObjectSchema } from './objects/system_job_run_logSelect.schema';
import { system_job_run_logCreateInputObjectSchema as system_job_run_logCreateInputObjectSchema } from './objects/system_job_run_logCreateInput.schema';
import { system_job_run_logUncheckedCreateInputObjectSchema as system_job_run_logUncheckedCreateInputObjectSchema } from './objects/system_job_run_logUncheckedCreateInput.schema';

export const system_job_run_logCreateOneSchema: z.ZodType<Prisma.system_job_run_logCreateArgs> = z.object({ select: system_job_run_logSelectObjectSchema.optional(),  data: z.union([system_job_run_logCreateInputObjectSchema, system_job_run_logUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.system_job_run_logCreateArgs>;

export const system_job_run_logCreateOneZodSchema = z.object({ select: system_job_run_logSelectObjectSchema.optional(),  data: z.union([system_job_run_logCreateInputObjectSchema, system_job_run_logUncheckedCreateInputObjectSchema]) }).strict();
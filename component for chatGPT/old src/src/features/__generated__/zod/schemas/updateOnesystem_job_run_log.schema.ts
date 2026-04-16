import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_run_logSelectObjectSchema as system_job_run_logSelectObjectSchema } from './objects/system_job_run_logSelect.schema';
import { system_job_run_logUpdateInputObjectSchema as system_job_run_logUpdateInputObjectSchema } from './objects/system_job_run_logUpdateInput.schema';
import { system_job_run_logUncheckedUpdateInputObjectSchema as system_job_run_logUncheckedUpdateInputObjectSchema } from './objects/system_job_run_logUncheckedUpdateInput.schema';
import { system_job_run_logWhereUniqueInputObjectSchema as system_job_run_logWhereUniqueInputObjectSchema } from './objects/system_job_run_logWhereUniqueInput.schema';

export const system_job_run_logUpdateOneSchema: z.ZodType<Prisma.system_job_run_logUpdateArgs> = z.object({ select: system_job_run_logSelectObjectSchema.optional(),  data: z.union([system_job_run_logUpdateInputObjectSchema, system_job_run_logUncheckedUpdateInputObjectSchema]), where: system_job_run_logWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.system_job_run_logUpdateArgs>;

export const system_job_run_logUpdateOneZodSchema = z.object({ select: system_job_run_logSelectObjectSchema.optional(),  data: z.union([system_job_run_logUpdateInputObjectSchema, system_job_run_logUncheckedUpdateInputObjectSchema]), where: system_job_run_logWhereUniqueInputObjectSchema }).strict();
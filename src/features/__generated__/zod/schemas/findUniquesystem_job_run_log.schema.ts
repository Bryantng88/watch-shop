import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_run_logSelectObjectSchema as system_job_run_logSelectObjectSchema } from './objects/system_job_run_logSelect.schema';
import { system_job_run_logWhereUniqueInputObjectSchema as system_job_run_logWhereUniqueInputObjectSchema } from './objects/system_job_run_logWhereUniqueInput.schema';

export const system_job_run_logFindUniqueSchema: z.ZodType<Prisma.system_job_run_logFindUniqueArgs> = z.object({ select: system_job_run_logSelectObjectSchema.optional(),  where: system_job_run_logWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.system_job_run_logFindUniqueArgs>;

export const system_job_run_logFindUniqueZodSchema = z.object({ select: system_job_run_logSelectObjectSchema.optional(),  where: system_job_run_logWhereUniqueInputObjectSchema }).strict();
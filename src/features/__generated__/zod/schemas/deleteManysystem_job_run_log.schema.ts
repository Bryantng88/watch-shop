import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_run_logWhereInputObjectSchema as system_job_run_logWhereInputObjectSchema } from './objects/system_job_run_logWhereInput.schema';

export const system_job_run_logDeleteManySchema: z.ZodType<Prisma.system_job_run_logDeleteManyArgs> = z.object({ where: system_job_run_logWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.system_job_run_logDeleteManyArgs>;

export const system_job_run_logDeleteManyZodSchema = z.object({ where: system_job_run_logWhereInputObjectSchema.optional() }).strict();
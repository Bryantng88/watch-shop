import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_run_logSelectObjectSchema as system_job_run_logSelectObjectSchema } from './objects/system_job_run_logSelect.schema';
import { system_job_run_logUpdateManyMutationInputObjectSchema as system_job_run_logUpdateManyMutationInputObjectSchema } from './objects/system_job_run_logUpdateManyMutationInput.schema';
import { system_job_run_logWhereInputObjectSchema as system_job_run_logWhereInputObjectSchema } from './objects/system_job_run_logWhereInput.schema';

export const system_job_run_logUpdateManyAndReturnSchema: z.ZodType<Prisma.system_job_run_logUpdateManyAndReturnArgs> = z.object({ select: system_job_run_logSelectObjectSchema.optional(), data: system_job_run_logUpdateManyMutationInputObjectSchema, where: system_job_run_logWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.system_job_run_logUpdateManyAndReturnArgs>;

export const system_job_run_logUpdateManyAndReturnZodSchema = z.object({ select: system_job_run_logSelectObjectSchema.optional(), data: system_job_run_logUpdateManyMutationInputObjectSchema, where: system_job_run_logWhereInputObjectSchema.optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_run_logSelectObjectSchema as system_job_run_logSelectObjectSchema } from './objects/system_job_run_logSelect.schema';
import { system_job_run_logCreateManyInputObjectSchema as system_job_run_logCreateManyInputObjectSchema } from './objects/system_job_run_logCreateManyInput.schema';

export const system_job_run_logCreateManyAndReturnSchema: z.ZodType<Prisma.system_job_run_logCreateManyAndReturnArgs> = z.object({ select: system_job_run_logSelectObjectSchema.optional(), data: z.union([ system_job_run_logCreateManyInputObjectSchema, z.array(system_job_run_logCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.system_job_run_logCreateManyAndReturnArgs>;

export const system_job_run_logCreateManyAndReturnZodSchema = z.object({ select: system_job_run_logSelectObjectSchema.optional(), data: z.union([ system_job_run_logCreateManyInputObjectSchema, z.array(system_job_run_logCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
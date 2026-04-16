import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_run_logCreateManyInputObjectSchema as system_job_run_logCreateManyInputObjectSchema } from './objects/system_job_run_logCreateManyInput.schema';

export const system_job_run_logCreateManySchema: z.ZodType<Prisma.system_job_run_logCreateManyArgs> = z.object({ data: z.union([ system_job_run_logCreateManyInputObjectSchema, z.array(system_job_run_logCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.system_job_run_logCreateManyArgs>;

export const system_job_run_logCreateManyZodSchema = z.object({ data: z.union([ system_job_run_logCreateManyInputObjectSchema, z.array(system_job_run_logCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
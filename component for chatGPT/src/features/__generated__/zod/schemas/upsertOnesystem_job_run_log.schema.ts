import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_run_logSelectObjectSchema as system_job_run_logSelectObjectSchema } from './objects/system_job_run_logSelect.schema';
import { system_job_run_logWhereUniqueInputObjectSchema as system_job_run_logWhereUniqueInputObjectSchema } from './objects/system_job_run_logWhereUniqueInput.schema';
import { system_job_run_logCreateInputObjectSchema as system_job_run_logCreateInputObjectSchema } from './objects/system_job_run_logCreateInput.schema';
import { system_job_run_logUncheckedCreateInputObjectSchema as system_job_run_logUncheckedCreateInputObjectSchema } from './objects/system_job_run_logUncheckedCreateInput.schema';
import { system_job_run_logUpdateInputObjectSchema as system_job_run_logUpdateInputObjectSchema } from './objects/system_job_run_logUpdateInput.schema';
import { system_job_run_logUncheckedUpdateInputObjectSchema as system_job_run_logUncheckedUpdateInputObjectSchema } from './objects/system_job_run_logUncheckedUpdateInput.schema';

export const system_job_run_logUpsertOneSchema: z.ZodType<Prisma.system_job_run_logUpsertArgs> = z.object({ select: system_job_run_logSelectObjectSchema.optional(),  where: system_job_run_logWhereUniqueInputObjectSchema, create: z.union([ system_job_run_logCreateInputObjectSchema, system_job_run_logUncheckedCreateInputObjectSchema ]), update: z.union([ system_job_run_logUpdateInputObjectSchema, system_job_run_logUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.system_job_run_logUpsertArgs>;

export const system_job_run_logUpsertOneZodSchema = z.object({ select: system_job_run_logSelectObjectSchema.optional(),  where: system_job_run_logWhereUniqueInputObjectSchema, create: z.union([ system_job_run_logCreateInputObjectSchema, system_job_run_logUncheckedCreateInputObjectSchema ]), update: z.union([ system_job_run_logUpdateInputObjectSchema, system_job_run_logUncheckedUpdateInputObjectSchema ]) }).strict();
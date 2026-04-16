import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_controlUpdateManyMutationInputObjectSchema as system_job_controlUpdateManyMutationInputObjectSchema } from './objects/system_job_controlUpdateManyMutationInput.schema';
import { system_job_controlWhereInputObjectSchema as system_job_controlWhereInputObjectSchema } from './objects/system_job_controlWhereInput.schema';

export const system_job_controlUpdateManySchema: z.ZodType<Prisma.system_job_controlUpdateManyArgs> = z.object({ data: system_job_controlUpdateManyMutationInputObjectSchema, where: system_job_controlWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.system_job_controlUpdateManyArgs>;

export const system_job_controlUpdateManyZodSchema = z.object({ data: system_job_controlUpdateManyMutationInputObjectSchema, where: system_job_controlWhereInputObjectSchema.optional() }).strict();
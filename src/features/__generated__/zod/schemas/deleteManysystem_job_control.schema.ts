import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_controlWhereInputObjectSchema as system_job_controlWhereInputObjectSchema } from './objects/system_job_controlWhereInput.schema';

export const system_job_controlDeleteManySchema: z.ZodType<Prisma.system_job_controlDeleteManyArgs> = z.object({ where: system_job_controlWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.system_job_controlDeleteManyArgs>;

export const system_job_controlDeleteManyZodSchema = z.object({ where: system_job_controlWhereInputObjectSchema.optional() }).strict();
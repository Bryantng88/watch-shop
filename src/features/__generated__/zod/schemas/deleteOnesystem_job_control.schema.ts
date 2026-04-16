import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_controlSelectObjectSchema as system_job_controlSelectObjectSchema } from './objects/system_job_controlSelect.schema';
import { system_job_controlWhereUniqueInputObjectSchema as system_job_controlWhereUniqueInputObjectSchema } from './objects/system_job_controlWhereUniqueInput.schema';

export const system_job_controlDeleteOneSchema: z.ZodType<Prisma.system_job_controlDeleteArgs> = z.object({ select: system_job_controlSelectObjectSchema.optional(),  where: system_job_controlWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.system_job_controlDeleteArgs>;

export const system_job_controlDeleteOneZodSchema = z.object({ select: system_job_controlSelectObjectSchema.optional(),  where: system_job_controlWhereUniqueInputObjectSchema }).strict();
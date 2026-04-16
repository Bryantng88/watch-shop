import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_controlSelectObjectSchema as system_job_controlSelectObjectSchema } from './objects/system_job_controlSelect.schema';
import { system_job_controlUpdateInputObjectSchema as system_job_controlUpdateInputObjectSchema } from './objects/system_job_controlUpdateInput.schema';
import { system_job_controlUncheckedUpdateInputObjectSchema as system_job_controlUncheckedUpdateInputObjectSchema } from './objects/system_job_controlUncheckedUpdateInput.schema';
import { system_job_controlWhereUniqueInputObjectSchema as system_job_controlWhereUniqueInputObjectSchema } from './objects/system_job_controlWhereUniqueInput.schema';

export const system_job_controlUpdateOneSchema: z.ZodType<Prisma.system_job_controlUpdateArgs> = z.object({ select: system_job_controlSelectObjectSchema.optional(),  data: z.union([system_job_controlUpdateInputObjectSchema, system_job_controlUncheckedUpdateInputObjectSchema]), where: system_job_controlWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.system_job_controlUpdateArgs>;

export const system_job_controlUpdateOneZodSchema = z.object({ select: system_job_controlSelectObjectSchema.optional(),  data: z.union([system_job_controlUpdateInputObjectSchema, system_job_controlUncheckedUpdateInputObjectSchema]), where: system_job_controlWhereUniqueInputObjectSchema }).strict();
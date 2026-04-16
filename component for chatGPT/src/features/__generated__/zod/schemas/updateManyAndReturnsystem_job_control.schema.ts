import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_controlSelectObjectSchema as system_job_controlSelectObjectSchema } from './objects/system_job_controlSelect.schema';
import { system_job_controlUpdateManyMutationInputObjectSchema as system_job_controlUpdateManyMutationInputObjectSchema } from './objects/system_job_controlUpdateManyMutationInput.schema';
import { system_job_controlWhereInputObjectSchema as system_job_controlWhereInputObjectSchema } from './objects/system_job_controlWhereInput.schema';

export const system_job_controlUpdateManyAndReturnSchema: z.ZodType<Prisma.system_job_controlUpdateManyAndReturnArgs> = z.object({ select: system_job_controlSelectObjectSchema.optional(), data: system_job_controlUpdateManyMutationInputObjectSchema, where: system_job_controlWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.system_job_controlUpdateManyAndReturnArgs>;

export const system_job_controlUpdateManyAndReturnZodSchema = z.object({ select: system_job_controlSelectObjectSchema.optional(), data: system_job_controlUpdateManyMutationInputObjectSchema, where: system_job_controlWhereInputObjectSchema.optional() }).strict();
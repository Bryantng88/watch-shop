import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_controlSelectObjectSchema as system_job_controlSelectObjectSchema } from './objects/system_job_controlSelect.schema';
import { system_job_controlWhereUniqueInputObjectSchema as system_job_controlWhereUniqueInputObjectSchema } from './objects/system_job_controlWhereUniqueInput.schema';

export const system_job_controlFindUniqueSchema: z.ZodType<Prisma.system_job_controlFindUniqueArgs> = z.object({ select: system_job_controlSelectObjectSchema.optional(),  where: system_job_controlWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.system_job_controlFindUniqueArgs>;

export const system_job_controlFindUniqueZodSchema = z.object({ select: system_job_controlSelectObjectSchema.optional(),  where: system_job_controlWhereUniqueInputObjectSchema }).strict();
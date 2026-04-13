import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_controlSelectObjectSchema as system_job_controlSelectObjectSchema } from './objects/system_job_controlSelect.schema';
import { system_job_controlWhereUniqueInputObjectSchema as system_job_controlWhereUniqueInputObjectSchema } from './objects/system_job_controlWhereUniqueInput.schema';

export const system_job_controlFindUniqueOrThrowSchema: z.ZodType<Prisma.system_job_controlFindUniqueOrThrowArgs> = z.object({ select: system_job_controlSelectObjectSchema.optional(),  where: system_job_controlWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.system_job_controlFindUniqueOrThrowArgs>;

export const system_job_controlFindUniqueOrThrowZodSchema = z.object({ select: system_job_controlSelectObjectSchema.optional(),  where: system_job_controlWhereUniqueInputObjectSchema }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_controlSelectObjectSchema as system_job_controlSelectObjectSchema } from './objects/system_job_controlSelect.schema';
import { system_job_controlCreateManyInputObjectSchema as system_job_controlCreateManyInputObjectSchema } from './objects/system_job_controlCreateManyInput.schema';

export const system_job_controlCreateManyAndReturnSchema: z.ZodType<Prisma.system_job_controlCreateManyAndReturnArgs> = z.object({ select: system_job_controlSelectObjectSchema.optional(), data: z.union([ system_job_controlCreateManyInputObjectSchema, z.array(system_job_controlCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.system_job_controlCreateManyAndReturnArgs>;

export const system_job_controlCreateManyAndReturnZodSchema = z.object({ select: system_job_controlSelectObjectSchema.optional(), data: z.union([ system_job_controlCreateManyInputObjectSchema, z.array(system_job_controlCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
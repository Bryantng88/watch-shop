import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_controlSelectObjectSchema as system_job_controlSelectObjectSchema } from './objects/system_job_controlSelect.schema';
import { system_job_controlCreateInputObjectSchema as system_job_controlCreateInputObjectSchema } from './objects/system_job_controlCreateInput.schema';
import { system_job_controlUncheckedCreateInputObjectSchema as system_job_controlUncheckedCreateInputObjectSchema } from './objects/system_job_controlUncheckedCreateInput.schema';

export const system_job_controlCreateOneSchema: z.ZodType<Prisma.system_job_controlCreateArgs> = z.object({ select: system_job_controlSelectObjectSchema.optional(),  data: z.union([system_job_controlCreateInputObjectSchema, system_job_controlUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.system_job_controlCreateArgs>;

export const system_job_controlCreateOneZodSchema = z.object({ select: system_job_controlSelectObjectSchema.optional(),  data: z.union([system_job_controlCreateInputObjectSchema, system_job_controlUncheckedCreateInputObjectSchema]) }).strict();
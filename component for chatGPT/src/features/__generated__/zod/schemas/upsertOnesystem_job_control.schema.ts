import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { system_job_controlSelectObjectSchema as system_job_controlSelectObjectSchema } from './objects/system_job_controlSelect.schema';
import { system_job_controlWhereUniqueInputObjectSchema as system_job_controlWhereUniqueInputObjectSchema } from './objects/system_job_controlWhereUniqueInput.schema';
import { system_job_controlCreateInputObjectSchema as system_job_controlCreateInputObjectSchema } from './objects/system_job_controlCreateInput.schema';
import { system_job_controlUncheckedCreateInputObjectSchema as system_job_controlUncheckedCreateInputObjectSchema } from './objects/system_job_controlUncheckedCreateInput.schema';
import { system_job_controlUpdateInputObjectSchema as system_job_controlUpdateInputObjectSchema } from './objects/system_job_controlUpdateInput.schema';
import { system_job_controlUncheckedUpdateInputObjectSchema as system_job_controlUncheckedUpdateInputObjectSchema } from './objects/system_job_controlUncheckedUpdateInput.schema';

export const system_job_controlUpsertOneSchema: z.ZodType<Prisma.system_job_controlUpsertArgs> = z.object({ select: system_job_controlSelectObjectSchema.optional(),  where: system_job_controlWhereUniqueInputObjectSchema, create: z.union([ system_job_controlCreateInputObjectSchema, system_job_controlUncheckedCreateInputObjectSchema ]), update: z.union([ system_job_controlUpdateInputObjectSchema, system_job_controlUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.system_job_controlUpsertArgs>;

export const system_job_controlUpsertOneZodSchema = z.object({ select: system_job_controlSelectObjectSchema.optional(),  where: system_job_controlWhereUniqueInputObjectSchema, create: z.union([ system_job_controlCreateInputObjectSchema, system_job_controlUncheckedCreateInputObjectSchema ]), update: z.union([ system_job_controlUpdateInputObjectSchema, system_job_controlUncheckedUpdateInputObjectSchema ]) }).strict();
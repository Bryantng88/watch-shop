import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobRunLogSelectObjectSchema as SystemJobRunLogSelectObjectSchema } from './objects/SystemJobRunLogSelect.schema';
import { SystemJobRunLogCreateInputObjectSchema as SystemJobRunLogCreateInputObjectSchema } from './objects/SystemJobRunLogCreateInput.schema';
import { SystemJobRunLogUncheckedCreateInputObjectSchema as SystemJobRunLogUncheckedCreateInputObjectSchema } from './objects/SystemJobRunLogUncheckedCreateInput.schema';

export const SystemJobRunLogCreateOneSchema: z.ZodType<Prisma.SystemJobRunLogCreateArgs> = z.object({ select: SystemJobRunLogSelectObjectSchema.optional(),  data: z.union([SystemJobRunLogCreateInputObjectSchema, SystemJobRunLogUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.SystemJobRunLogCreateArgs>;

export const SystemJobRunLogCreateOneZodSchema = z.object({ select: SystemJobRunLogSelectObjectSchema.optional(),  data: z.union([SystemJobRunLogCreateInputObjectSchema, SystemJobRunLogUncheckedCreateInputObjectSchema]) }).strict();
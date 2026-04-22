import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobRunLogSelectObjectSchema as SystemJobRunLogSelectObjectSchema } from './objects/SystemJobRunLogSelect.schema';
import { SystemJobRunLogUpdateInputObjectSchema as SystemJobRunLogUpdateInputObjectSchema } from './objects/SystemJobRunLogUpdateInput.schema';
import { SystemJobRunLogUncheckedUpdateInputObjectSchema as SystemJobRunLogUncheckedUpdateInputObjectSchema } from './objects/SystemJobRunLogUncheckedUpdateInput.schema';
import { SystemJobRunLogWhereUniqueInputObjectSchema as SystemJobRunLogWhereUniqueInputObjectSchema } from './objects/SystemJobRunLogWhereUniqueInput.schema';

export const SystemJobRunLogUpdateOneSchema: z.ZodType<Prisma.SystemJobRunLogUpdateArgs> = z.object({ select: SystemJobRunLogSelectObjectSchema.optional(),  data: z.union([SystemJobRunLogUpdateInputObjectSchema, SystemJobRunLogUncheckedUpdateInputObjectSchema]), where: SystemJobRunLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemJobRunLogUpdateArgs>;

export const SystemJobRunLogUpdateOneZodSchema = z.object({ select: SystemJobRunLogSelectObjectSchema.optional(),  data: z.union([SystemJobRunLogUpdateInputObjectSchema, SystemJobRunLogUncheckedUpdateInputObjectSchema]), where: SystemJobRunLogWhereUniqueInputObjectSchema }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobRunLogSelectObjectSchema as SystemJobRunLogSelectObjectSchema } from './objects/SystemJobRunLogSelect.schema';
import { SystemJobRunLogWhereUniqueInputObjectSchema as SystemJobRunLogWhereUniqueInputObjectSchema } from './objects/SystemJobRunLogWhereUniqueInput.schema';
import { SystemJobRunLogCreateInputObjectSchema as SystemJobRunLogCreateInputObjectSchema } from './objects/SystemJobRunLogCreateInput.schema';
import { SystemJobRunLogUncheckedCreateInputObjectSchema as SystemJobRunLogUncheckedCreateInputObjectSchema } from './objects/SystemJobRunLogUncheckedCreateInput.schema';
import { SystemJobRunLogUpdateInputObjectSchema as SystemJobRunLogUpdateInputObjectSchema } from './objects/SystemJobRunLogUpdateInput.schema';
import { SystemJobRunLogUncheckedUpdateInputObjectSchema as SystemJobRunLogUncheckedUpdateInputObjectSchema } from './objects/SystemJobRunLogUncheckedUpdateInput.schema';

export const SystemJobRunLogUpsertOneSchema: z.ZodType<Prisma.SystemJobRunLogUpsertArgs> = z.object({ select: SystemJobRunLogSelectObjectSchema.optional(),  where: SystemJobRunLogWhereUniqueInputObjectSchema, create: z.union([ SystemJobRunLogCreateInputObjectSchema, SystemJobRunLogUncheckedCreateInputObjectSchema ]), update: z.union([ SystemJobRunLogUpdateInputObjectSchema, SystemJobRunLogUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.SystemJobRunLogUpsertArgs>;

export const SystemJobRunLogUpsertOneZodSchema = z.object({ select: SystemJobRunLogSelectObjectSchema.optional(),  where: SystemJobRunLogWhereUniqueInputObjectSchema, create: z.union([ SystemJobRunLogCreateInputObjectSchema, SystemJobRunLogUncheckedCreateInputObjectSchema ]), update: z.union([ SystemJobRunLogUpdateInputObjectSchema, SystemJobRunLogUncheckedUpdateInputObjectSchema ]) }).strict();
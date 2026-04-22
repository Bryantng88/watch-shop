import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobControlSelectObjectSchema as SystemJobControlSelectObjectSchema } from './objects/SystemJobControlSelect.schema';
import { SystemJobControlWhereUniqueInputObjectSchema as SystemJobControlWhereUniqueInputObjectSchema } from './objects/SystemJobControlWhereUniqueInput.schema';
import { SystemJobControlCreateInputObjectSchema as SystemJobControlCreateInputObjectSchema } from './objects/SystemJobControlCreateInput.schema';
import { SystemJobControlUncheckedCreateInputObjectSchema as SystemJobControlUncheckedCreateInputObjectSchema } from './objects/SystemJobControlUncheckedCreateInput.schema';
import { SystemJobControlUpdateInputObjectSchema as SystemJobControlUpdateInputObjectSchema } from './objects/SystemJobControlUpdateInput.schema';
import { SystemJobControlUncheckedUpdateInputObjectSchema as SystemJobControlUncheckedUpdateInputObjectSchema } from './objects/SystemJobControlUncheckedUpdateInput.schema';

export const SystemJobControlUpsertOneSchema: z.ZodType<Prisma.SystemJobControlUpsertArgs> = z.object({ select: SystemJobControlSelectObjectSchema.optional(),  where: SystemJobControlWhereUniqueInputObjectSchema, create: z.union([ SystemJobControlCreateInputObjectSchema, SystemJobControlUncheckedCreateInputObjectSchema ]), update: z.union([ SystemJobControlUpdateInputObjectSchema, SystemJobControlUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.SystemJobControlUpsertArgs>;

export const SystemJobControlUpsertOneZodSchema = z.object({ select: SystemJobControlSelectObjectSchema.optional(),  where: SystemJobControlWhereUniqueInputObjectSchema, create: z.union([ SystemJobControlCreateInputObjectSchema, SystemJobControlUncheckedCreateInputObjectSchema ]), update: z.union([ SystemJobControlUpdateInputObjectSchema, SystemJobControlUncheckedUpdateInputObjectSchema ]) }).strict();
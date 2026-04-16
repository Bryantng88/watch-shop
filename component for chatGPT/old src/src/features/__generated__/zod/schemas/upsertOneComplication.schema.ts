import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ComplicationSelectObjectSchema as ComplicationSelectObjectSchema } from './objects/ComplicationSelect.schema';
import { ComplicationIncludeObjectSchema as ComplicationIncludeObjectSchema } from './objects/ComplicationInclude.schema';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './objects/ComplicationWhereUniqueInput.schema';
import { ComplicationCreateInputObjectSchema as ComplicationCreateInputObjectSchema } from './objects/ComplicationCreateInput.schema';
import { ComplicationUncheckedCreateInputObjectSchema as ComplicationUncheckedCreateInputObjectSchema } from './objects/ComplicationUncheckedCreateInput.schema';
import { ComplicationUpdateInputObjectSchema as ComplicationUpdateInputObjectSchema } from './objects/ComplicationUpdateInput.schema';
import { ComplicationUncheckedUpdateInputObjectSchema as ComplicationUncheckedUpdateInputObjectSchema } from './objects/ComplicationUncheckedUpdateInput.schema';

export const ComplicationUpsertOneSchema: z.ZodType<Prisma.ComplicationUpsertArgs> = z.object({ select: ComplicationSelectObjectSchema.optional(), include: ComplicationIncludeObjectSchema.optional(), where: ComplicationWhereUniqueInputObjectSchema, create: z.union([ ComplicationCreateInputObjectSchema, ComplicationUncheckedCreateInputObjectSchema ]), update: z.union([ ComplicationUpdateInputObjectSchema, ComplicationUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ComplicationUpsertArgs>;

export const ComplicationUpsertOneZodSchema = z.object({ select: ComplicationSelectObjectSchema.optional(), include: ComplicationIncludeObjectSchema.optional(), where: ComplicationWhereUniqueInputObjectSchema, create: z.union([ ComplicationCreateInputObjectSchema, ComplicationUncheckedCreateInputObjectSchema ]), update: z.union([ ComplicationUpdateInputObjectSchema, ComplicationUncheckedUpdateInputObjectSchema ]) }).strict();
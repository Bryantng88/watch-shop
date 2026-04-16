import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ComplicationSelectObjectSchema as ComplicationSelectObjectSchema } from './objects/ComplicationSelect.schema';
import { ComplicationIncludeObjectSchema as ComplicationIncludeObjectSchema } from './objects/ComplicationInclude.schema';
import { ComplicationUpdateInputObjectSchema as ComplicationUpdateInputObjectSchema } from './objects/ComplicationUpdateInput.schema';
import { ComplicationUncheckedUpdateInputObjectSchema as ComplicationUncheckedUpdateInputObjectSchema } from './objects/ComplicationUncheckedUpdateInput.schema';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './objects/ComplicationWhereUniqueInput.schema';

export const ComplicationUpdateOneSchema: z.ZodType<Prisma.ComplicationUpdateArgs> = z.object({ select: ComplicationSelectObjectSchema.optional(), include: ComplicationIncludeObjectSchema.optional(), data: z.union([ComplicationUpdateInputObjectSchema, ComplicationUncheckedUpdateInputObjectSchema]), where: ComplicationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ComplicationUpdateArgs>;

export const ComplicationUpdateOneZodSchema = z.object({ select: ComplicationSelectObjectSchema.optional(), include: ComplicationIncludeObjectSchema.optional(), data: z.union([ComplicationUpdateInputObjectSchema, ComplicationUncheckedUpdateInputObjectSchema]), where: ComplicationWhereUniqueInputObjectSchema }).strict();
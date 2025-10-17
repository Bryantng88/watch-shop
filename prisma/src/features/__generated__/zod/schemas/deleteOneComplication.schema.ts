import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ComplicationSelectObjectSchema as ComplicationSelectObjectSchema } from './objects/ComplicationSelect.schema';
import { ComplicationIncludeObjectSchema as ComplicationIncludeObjectSchema } from './objects/ComplicationInclude.schema';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './objects/ComplicationWhereUniqueInput.schema';

export const ComplicationDeleteOneSchema: z.ZodType<Prisma.ComplicationDeleteArgs> = z.object({ select: ComplicationSelectObjectSchema.optional(), include: ComplicationIncludeObjectSchema.optional(), where: ComplicationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ComplicationDeleteArgs>;

export const ComplicationDeleteOneZodSchema = z.object({ select: ComplicationSelectObjectSchema.optional(), include: ComplicationIncludeObjectSchema.optional(), where: ComplicationWhereUniqueInputObjectSchema }).strict();
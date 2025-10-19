import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ComplicationSelectObjectSchema as ComplicationSelectObjectSchema } from './objects/ComplicationSelect.schema';
import { ComplicationIncludeObjectSchema as ComplicationIncludeObjectSchema } from './objects/ComplicationInclude.schema';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './objects/ComplicationWhereUniqueInput.schema';

export const ComplicationFindUniqueSchema: z.ZodType<Prisma.ComplicationFindUniqueArgs> = z.object({ select: ComplicationSelectObjectSchema.optional(), include: ComplicationIncludeObjectSchema.optional(), where: ComplicationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ComplicationFindUniqueArgs>;

export const ComplicationFindUniqueZodSchema = z.object({ select: ComplicationSelectObjectSchema.optional(), include: ComplicationIncludeObjectSchema.optional(), where: ComplicationWhereUniqueInputObjectSchema }).strict();
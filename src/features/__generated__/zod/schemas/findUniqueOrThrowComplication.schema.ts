import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ComplicationSelectObjectSchema as ComplicationSelectObjectSchema } from './objects/ComplicationSelect.schema';
import { ComplicationIncludeObjectSchema as ComplicationIncludeObjectSchema } from './objects/ComplicationInclude.schema';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './objects/ComplicationWhereUniqueInput.schema';

export const ComplicationFindUniqueOrThrowSchema: z.ZodType<Prisma.ComplicationFindUniqueOrThrowArgs> = z.object({ select: ComplicationSelectObjectSchema.optional(), include: ComplicationIncludeObjectSchema.optional(), where: ComplicationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ComplicationFindUniqueOrThrowArgs>;

export const ComplicationFindUniqueOrThrowZodSchema = z.object({ select: ComplicationSelectObjectSchema.optional(), include: ComplicationIncludeObjectSchema.optional(), where: ComplicationWhereUniqueInputObjectSchema }).strict();
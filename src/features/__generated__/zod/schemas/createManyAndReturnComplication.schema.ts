import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ComplicationSelectObjectSchema as ComplicationSelectObjectSchema } from './objects/ComplicationSelect.schema';
import { ComplicationCreateManyInputObjectSchema as ComplicationCreateManyInputObjectSchema } from './objects/ComplicationCreateManyInput.schema';

export const ComplicationCreateManyAndReturnSchema: z.ZodType<Prisma.ComplicationCreateManyAndReturnArgs> = z.object({ select: ComplicationSelectObjectSchema.optional(), data: z.union([ ComplicationCreateManyInputObjectSchema, z.array(ComplicationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ComplicationCreateManyAndReturnArgs>;

export const ComplicationCreateManyAndReturnZodSchema = z.object({ select: ComplicationSelectObjectSchema.optional(), data: z.union([ ComplicationCreateManyInputObjectSchema, z.array(ComplicationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
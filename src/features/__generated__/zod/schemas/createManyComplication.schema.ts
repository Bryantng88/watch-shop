import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ComplicationCreateManyInputObjectSchema as ComplicationCreateManyInputObjectSchema } from './objects/ComplicationCreateManyInput.schema';

export const ComplicationCreateManySchema: z.ZodType<Prisma.ComplicationCreateManyArgs> = z.object({ data: z.union([ ComplicationCreateManyInputObjectSchema, z.array(ComplicationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ComplicationCreateManyArgs>;

export const ComplicationCreateManyZodSchema = z.object({ data: z.union([ ComplicationCreateManyInputObjectSchema, z.array(ComplicationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
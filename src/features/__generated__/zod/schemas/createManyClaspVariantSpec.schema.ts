import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ClaspVariantSpecCreateManyInputObjectSchema as ClaspVariantSpecCreateManyInputObjectSchema } from './objects/ClaspVariantSpecCreateManyInput.schema';

export const ClaspVariantSpecCreateManySchema: z.ZodType<Prisma.ClaspVariantSpecCreateManyArgs> = z.object({ data: z.union([ ClaspVariantSpecCreateManyInputObjectSchema, z.array(ClaspVariantSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ClaspVariantSpecCreateManyArgs>;

export const ClaspVariantSpecCreateManyZodSchema = z.object({ data: z.union([ ClaspVariantSpecCreateManyInputObjectSchema, z.array(ClaspVariantSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
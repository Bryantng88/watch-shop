import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ClaspVariantSpecSelectObjectSchema as ClaspVariantSpecSelectObjectSchema } from './objects/ClaspVariantSpecSelect.schema';
import { ClaspVariantSpecCreateManyInputObjectSchema as ClaspVariantSpecCreateManyInputObjectSchema } from './objects/ClaspVariantSpecCreateManyInput.schema';

export const ClaspVariantSpecCreateManyAndReturnSchema: z.ZodType<Prisma.ClaspVariantSpecCreateManyAndReturnArgs> = z.object({ select: ClaspVariantSpecSelectObjectSchema.optional(), data: z.union([ ClaspVariantSpecCreateManyInputObjectSchema, z.array(ClaspVariantSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ClaspVariantSpecCreateManyAndReturnArgs>;

export const ClaspVariantSpecCreateManyAndReturnZodSchema = z.object({ select: ClaspVariantSpecSelectObjectSchema.optional(), data: z.union([ ClaspVariantSpecCreateManyInputObjectSchema, z.array(ClaspVariantSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
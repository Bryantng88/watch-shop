import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapVariantSpecSelectObjectSchema as StrapVariantSpecSelectObjectSchema } from './objects/StrapVariantSpecSelect.schema';
import { StrapVariantSpecCreateManyInputObjectSchema as StrapVariantSpecCreateManyInputObjectSchema } from './objects/StrapVariantSpecCreateManyInput.schema';

export const StrapVariantSpecCreateManyAndReturnSchema: z.ZodType<Prisma.StrapVariantSpecCreateManyAndReturnArgs> = z.object({ select: StrapVariantSpecSelectObjectSchema.optional(), data: z.union([ StrapVariantSpecCreateManyInputObjectSchema, z.array(StrapVariantSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.StrapVariantSpecCreateManyAndReturnArgs>;

export const StrapVariantSpecCreateManyAndReturnZodSchema = z.object({ select: StrapVariantSpecSelectObjectSchema.optional(), data: z.union([ StrapVariantSpecCreateManyInputObjectSchema, z.array(StrapVariantSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
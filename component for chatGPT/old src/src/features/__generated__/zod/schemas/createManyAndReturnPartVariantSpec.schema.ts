import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PartVariantSpecSelectObjectSchema as PartVariantSpecSelectObjectSchema } from './objects/PartVariantSpecSelect.schema';
import { PartVariantSpecCreateManyInputObjectSchema as PartVariantSpecCreateManyInputObjectSchema } from './objects/PartVariantSpecCreateManyInput.schema';

export const PartVariantSpecCreateManyAndReturnSchema: z.ZodType<Prisma.PartVariantSpecCreateManyAndReturnArgs> = z.object({ select: PartVariantSpecSelectObjectSchema.optional(), data: z.union([ PartVariantSpecCreateManyInputObjectSchema, z.array(PartVariantSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.PartVariantSpecCreateManyAndReturnArgs>;

export const PartVariantSpecCreateManyAndReturnZodSchema = z.object({ select: PartVariantSpecSelectObjectSchema.optional(), data: z.union([ PartVariantSpecCreateManyInputObjectSchema, z.array(PartVariantSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
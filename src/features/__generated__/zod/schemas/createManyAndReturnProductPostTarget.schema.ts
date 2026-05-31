import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductPostTargetSelectObjectSchema as ProductPostTargetSelectObjectSchema } from './objects/ProductPostTargetSelect.schema';
import { ProductPostTargetCreateManyInputObjectSchema as ProductPostTargetCreateManyInputObjectSchema } from './objects/ProductPostTargetCreateManyInput.schema';

export const ProductPostTargetCreateManyAndReturnSchema: z.ZodType<Prisma.ProductPostTargetCreateManyAndReturnArgs> = z.object({ select: ProductPostTargetSelectObjectSchema.optional(), data: z.union([ ProductPostTargetCreateManyInputObjectSchema, z.array(ProductPostTargetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProductPostTargetCreateManyAndReturnArgs>;

export const ProductPostTargetCreateManyAndReturnZodSchema = z.object({ select: ProductPostTargetSelectObjectSchema.optional(), data: z.union([ ProductPostTargetCreateManyInputObjectSchema, z.array(ProductPostTargetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
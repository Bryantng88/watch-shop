import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductPostTargetCreateManyInputObjectSchema as ProductPostTargetCreateManyInputObjectSchema } from './objects/ProductPostTargetCreateManyInput.schema';

export const ProductPostTargetCreateManySchema: z.ZodType<Prisma.ProductPostTargetCreateManyArgs> = z.object({ data: z.union([ ProductPostTargetCreateManyInputObjectSchema, z.array(ProductPostTargetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProductPostTargetCreateManyArgs>;

export const ProductPostTargetCreateManyZodSchema = z.object({ data: z.union([ ProductPostTargetCreateManyInputObjectSchema, z.array(ProductPostTargetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
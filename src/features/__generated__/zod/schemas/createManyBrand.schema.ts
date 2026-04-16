import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BrandCreateManyInputObjectSchema as BrandCreateManyInputObjectSchema } from './objects/BrandCreateManyInput.schema';

export const BrandCreateManySchema: z.ZodType<Prisma.BrandCreateManyArgs> = z.object({ data: z.union([ BrandCreateManyInputObjectSchema, z.array(BrandCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.BrandCreateManyArgs>;

export const BrandCreateManyZodSchema = z.object({ data: z.union([ BrandCreateManyInputObjectSchema, z.array(BrandCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
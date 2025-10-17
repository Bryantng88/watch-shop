import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BrandSelectObjectSchema as BrandSelectObjectSchema } from './objects/BrandSelect.schema';
import { BrandCreateManyInputObjectSchema as BrandCreateManyInputObjectSchema } from './objects/BrandCreateManyInput.schema';

export const BrandCreateManyAndReturnSchema: z.ZodType<Prisma.BrandCreateManyAndReturnArgs> = z.object({ select: BrandSelectObjectSchema.optional(), data: z.union([ BrandCreateManyInputObjectSchema, z.array(BrandCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.BrandCreateManyAndReturnArgs>;

export const BrandCreateManyAndReturnZodSchema = z.object({ select: BrandSelectObjectSchema.optional(), data: z.union([ BrandCreateManyInputObjectSchema, z.array(BrandCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
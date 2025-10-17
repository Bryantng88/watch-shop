import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PartVariantSpecCreateManyInputObjectSchema as PartVariantSpecCreateManyInputObjectSchema } from './objects/PartVariantSpecCreateManyInput.schema';

export const PartVariantSpecCreateManySchema: z.ZodType<Prisma.PartVariantSpecCreateManyArgs> = z.object({ data: z.union([ PartVariantSpecCreateManyInputObjectSchema, z.array(PartVariantSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.PartVariantSpecCreateManyArgs>;

export const PartVariantSpecCreateManyZodSchema = z.object({ data: z.union([ PartVariantSpecCreateManyInputObjectSchema, z.array(PartVariantSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
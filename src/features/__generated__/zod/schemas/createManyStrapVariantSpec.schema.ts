import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapVariantSpecCreateManyInputObjectSchema as StrapVariantSpecCreateManyInputObjectSchema } from './objects/StrapVariantSpecCreateManyInput.schema';

export const StrapVariantSpecCreateManySchema: z.ZodType<Prisma.StrapVariantSpecCreateManyArgs> = z.object({ data: z.union([ StrapVariantSpecCreateManyInputObjectSchema, z.array(StrapVariantSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.StrapVariantSpecCreateManyArgs>;

export const StrapVariantSpecCreateManyZodSchema = z.object({ data: z.union([ StrapVariantSpecCreateManyInputObjectSchema, z.array(StrapVariantSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
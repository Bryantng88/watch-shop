import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapCatalogOptionCreateManyInputObjectSchema as StrapCatalogOptionCreateManyInputObjectSchema } from './objects/StrapCatalogOptionCreateManyInput.schema';

export const StrapCatalogOptionCreateManySchema: z.ZodType<Prisma.StrapCatalogOptionCreateManyArgs> = z.object({ data: z.union([ StrapCatalogOptionCreateManyInputObjectSchema, z.array(StrapCatalogOptionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.StrapCatalogOptionCreateManyArgs>;

export const StrapCatalogOptionCreateManyZodSchema = z.object({ data: z.union([ StrapCatalogOptionCreateManyInputObjectSchema, z.array(StrapCatalogOptionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapCatalogOptionSelectObjectSchema as StrapCatalogOptionSelectObjectSchema } from './objects/StrapCatalogOptionSelect.schema';
import { StrapCatalogOptionCreateManyInputObjectSchema as StrapCatalogOptionCreateManyInputObjectSchema } from './objects/StrapCatalogOptionCreateManyInput.schema';

export const StrapCatalogOptionCreateManyAndReturnSchema: z.ZodType<Prisma.StrapCatalogOptionCreateManyAndReturnArgs> = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(), data: z.union([ StrapCatalogOptionCreateManyInputObjectSchema, z.array(StrapCatalogOptionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.StrapCatalogOptionCreateManyAndReturnArgs>;

export const StrapCatalogOptionCreateManyAndReturnZodSchema = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(), data: z.union([ StrapCatalogOptionCreateManyInputObjectSchema, z.array(StrapCatalogOptionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
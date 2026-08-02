import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapCatalogOptionSelectObjectSchema as StrapCatalogOptionSelectObjectSchema } from './objects/StrapCatalogOptionSelect.schema';
import { StrapCatalogOptionCreateInputObjectSchema as StrapCatalogOptionCreateInputObjectSchema } from './objects/StrapCatalogOptionCreateInput.schema';
import { StrapCatalogOptionUncheckedCreateInputObjectSchema as StrapCatalogOptionUncheckedCreateInputObjectSchema } from './objects/StrapCatalogOptionUncheckedCreateInput.schema';

export const StrapCatalogOptionCreateOneSchema: z.ZodType<Prisma.StrapCatalogOptionCreateArgs> = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(),  data: z.union([StrapCatalogOptionCreateInputObjectSchema, StrapCatalogOptionUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.StrapCatalogOptionCreateArgs>;

export const StrapCatalogOptionCreateOneZodSchema = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(),  data: z.union([StrapCatalogOptionCreateInputObjectSchema, StrapCatalogOptionUncheckedCreateInputObjectSchema]) }).strict();
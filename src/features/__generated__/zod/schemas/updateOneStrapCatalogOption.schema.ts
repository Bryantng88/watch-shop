import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapCatalogOptionSelectObjectSchema as StrapCatalogOptionSelectObjectSchema } from './objects/StrapCatalogOptionSelect.schema';
import { StrapCatalogOptionUpdateInputObjectSchema as StrapCatalogOptionUpdateInputObjectSchema } from './objects/StrapCatalogOptionUpdateInput.schema';
import { StrapCatalogOptionUncheckedUpdateInputObjectSchema as StrapCatalogOptionUncheckedUpdateInputObjectSchema } from './objects/StrapCatalogOptionUncheckedUpdateInput.schema';
import { StrapCatalogOptionWhereUniqueInputObjectSchema as StrapCatalogOptionWhereUniqueInputObjectSchema } from './objects/StrapCatalogOptionWhereUniqueInput.schema';

export const StrapCatalogOptionUpdateOneSchema: z.ZodType<Prisma.StrapCatalogOptionUpdateArgs> = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(),  data: z.union([StrapCatalogOptionUpdateInputObjectSchema, StrapCatalogOptionUncheckedUpdateInputObjectSchema]), where: StrapCatalogOptionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.StrapCatalogOptionUpdateArgs>;

export const StrapCatalogOptionUpdateOneZodSchema = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(),  data: z.union([StrapCatalogOptionUpdateInputObjectSchema, StrapCatalogOptionUncheckedUpdateInputObjectSchema]), where: StrapCatalogOptionWhereUniqueInputObjectSchema }).strict();
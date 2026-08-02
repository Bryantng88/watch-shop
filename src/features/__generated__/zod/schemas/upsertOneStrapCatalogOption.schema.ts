import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapCatalogOptionSelectObjectSchema as StrapCatalogOptionSelectObjectSchema } from './objects/StrapCatalogOptionSelect.schema';
import { StrapCatalogOptionWhereUniqueInputObjectSchema as StrapCatalogOptionWhereUniqueInputObjectSchema } from './objects/StrapCatalogOptionWhereUniqueInput.schema';
import { StrapCatalogOptionCreateInputObjectSchema as StrapCatalogOptionCreateInputObjectSchema } from './objects/StrapCatalogOptionCreateInput.schema';
import { StrapCatalogOptionUncheckedCreateInputObjectSchema as StrapCatalogOptionUncheckedCreateInputObjectSchema } from './objects/StrapCatalogOptionUncheckedCreateInput.schema';
import { StrapCatalogOptionUpdateInputObjectSchema as StrapCatalogOptionUpdateInputObjectSchema } from './objects/StrapCatalogOptionUpdateInput.schema';
import { StrapCatalogOptionUncheckedUpdateInputObjectSchema as StrapCatalogOptionUncheckedUpdateInputObjectSchema } from './objects/StrapCatalogOptionUncheckedUpdateInput.schema';

export const StrapCatalogOptionUpsertOneSchema: z.ZodType<Prisma.StrapCatalogOptionUpsertArgs> = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(),  where: StrapCatalogOptionWhereUniqueInputObjectSchema, create: z.union([ StrapCatalogOptionCreateInputObjectSchema, StrapCatalogOptionUncheckedCreateInputObjectSchema ]), update: z.union([ StrapCatalogOptionUpdateInputObjectSchema, StrapCatalogOptionUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.StrapCatalogOptionUpsertArgs>;

export const StrapCatalogOptionUpsertOneZodSchema = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(),  where: StrapCatalogOptionWhereUniqueInputObjectSchema, create: z.union([ StrapCatalogOptionCreateInputObjectSchema, StrapCatalogOptionUncheckedCreateInputObjectSchema ]), update: z.union([ StrapCatalogOptionUpdateInputObjectSchema, StrapCatalogOptionUncheckedUpdateInputObjectSchema ]) }).strict();
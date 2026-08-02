import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapCatalogOptionUpdateManyMutationInputObjectSchema as StrapCatalogOptionUpdateManyMutationInputObjectSchema } from './objects/StrapCatalogOptionUpdateManyMutationInput.schema';
import { StrapCatalogOptionWhereInputObjectSchema as StrapCatalogOptionWhereInputObjectSchema } from './objects/StrapCatalogOptionWhereInput.schema';

export const StrapCatalogOptionUpdateManySchema: z.ZodType<Prisma.StrapCatalogOptionUpdateManyArgs> = z.object({ data: StrapCatalogOptionUpdateManyMutationInputObjectSchema, where: StrapCatalogOptionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.StrapCatalogOptionUpdateManyArgs>;

export const StrapCatalogOptionUpdateManyZodSchema = z.object({ data: StrapCatalogOptionUpdateManyMutationInputObjectSchema, where: StrapCatalogOptionWhereInputObjectSchema.optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapCatalogOptionSelectObjectSchema as StrapCatalogOptionSelectObjectSchema } from './objects/StrapCatalogOptionSelect.schema';
import { StrapCatalogOptionUpdateManyMutationInputObjectSchema as StrapCatalogOptionUpdateManyMutationInputObjectSchema } from './objects/StrapCatalogOptionUpdateManyMutationInput.schema';
import { StrapCatalogOptionWhereInputObjectSchema as StrapCatalogOptionWhereInputObjectSchema } from './objects/StrapCatalogOptionWhereInput.schema';

export const StrapCatalogOptionUpdateManyAndReturnSchema: z.ZodType<Prisma.StrapCatalogOptionUpdateManyAndReturnArgs> = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(), data: StrapCatalogOptionUpdateManyMutationInputObjectSchema, where: StrapCatalogOptionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.StrapCatalogOptionUpdateManyAndReturnArgs>;

export const StrapCatalogOptionUpdateManyAndReturnZodSchema = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(), data: StrapCatalogOptionUpdateManyMutationInputObjectSchema, where: StrapCatalogOptionWhereInputObjectSchema.optional() }).strict();
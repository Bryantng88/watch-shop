import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapCatalogOptionSelectObjectSchema as StrapCatalogOptionSelectObjectSchema } from './objects/StrapCatalogOptionSelect.schema';
import { StrapCatalogOptionWhereUniqueInputObjectSchema as StrapCatalogOptionWhereUniqueInputObjectSchema } from './objects/StrapCatalogOptionWhereUniqueInput.schema';

export const StrapCatalogOptionFindUniqueSchema: z.ZodType<Prisma.StrapCatalogOptionFindUniqueArgs> = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(),  where: StrapCatalogOptionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.StrapCatalogOptionFindUniqueArgs>;

export const StrapCatalogOptionFindUniqueZodSchema = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(),  where: StrapCatalogOptionWhereUniqueInputObjectSchema }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapCatalogOptionSelectObjectSchema as StrapCatalogOptionSelectObjectSchema } from './objects/StrapCatalogOptionSelect.schema';
import { StrapCatalogOptionWhereUniqueInputObjectSchema as StrapCatalogOptionWhereUniqueInputObjectSchema } from './objects/StrapCatalogOptionWhereUniqueInput.schema';

export const StrapCatalogOptionDeleteOneSchema: z.ZodType<Prisma.StrapCatalogOptionDeleteArgs> = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(),  where: StrapCatalogOptionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.StrapCatalogOptionDeleteArgs>;

export const StrapCatalogOptionDeleteOneZodSchema = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(),  where: StrapCatalogOptionWhereUniqueInputObjectSchema }).strict();
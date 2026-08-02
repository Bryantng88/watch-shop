import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapCatalogOptionSelectObjectSchema as StrapCatalogOptionSelectObjectSchema } from './objects/StrapCatalogOptionSelect.schema';
import { StrapCatalogOptionWhereUniqueInputObjectSchema as StrapCatalogOptionWhereUniqueInputObjectSchema } from './objects/StrapCatalogOptionWhereUniqueInput.schema';

export const StrapCatalogOptionFindUniqueOrThrowSchema: z.ZodType<Prisma.StrapCatalogOptionFindUniqueOrThrowArgs> = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(),  where: StrapCatalogOptionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.StrapCatalogOptionFindUniqueOrThrowArgs>;

export const StrapCatalogOptionFindUniqueOrThrowZodSchema = z.object({ select: StrapCatalogOptionSelectObjectSchema.optional(),  where: StrapCatalogOptionWhereUniqueInputObjectSchema }).strict();
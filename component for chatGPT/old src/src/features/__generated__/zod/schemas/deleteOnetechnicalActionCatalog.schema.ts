import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalActionCatalogSelectObjectSchema as technicalActionCatalogSelectObjectSchema } from './objects/technicalActionCatalogSelect.schema';
import { technicalActionCatalogWhereUniqueInputObjectSchema as technicalActionCatalogWhereUniqueInputObjectSchema } from './objects/technicalActionCatalogWhereUniqueInput.schema';

export const technicalActionCatalogDeleteOneSchema: z.ZodType<Prisma.technicalActionCatalogDeleteArgs> = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(),  where: technicalActionCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.technicalActionCatalogDeleteArgs>;

export const technicalActionCatalogDeleteOneZodSchema = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(),  where: technicalActionCatalogWhereUniqueInputObjectSchema }).strict();
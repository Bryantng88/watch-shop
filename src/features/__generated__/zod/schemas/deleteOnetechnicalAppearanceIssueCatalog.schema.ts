import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAppearanceIssueCatalogSelectObjectSchema as technicalAppearanceIssueCatalogSelectObjectSchema } from './objects/technicalAppearanceIssueCatalogSelect.schema';
import { technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema as technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema } from './objects/technicalAppearanceIssueCatalogWhereUniqueInput.schema';

export const technicalAppearanceIssueCatalogDeleteOneSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogDeleteArgs> = z.object({ select: technicalAppearanceIssueCatalogSelectObjectSchema.optional(),  where: technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogDeleteArgs>;

export const technicalAppearanceIssueCatalogDeleteOneZodSchema = z.object({ select: technicalAppearanceIssueCatalogSelectObjectSchema.optional(),  where: technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema }).strict();
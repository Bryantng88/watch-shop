import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAppearanceIssueCatalogSelectObjectSchema as technicalAppearanceIssueCatalogSelectObjectSchema } from './objects/technicalAppearanceIssueCatalogSelect.schema';
import { technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema as technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema } from './objects/technicalAppearanceIssueCatalogWhereUniqueInput.schema';

export const technicalAppearanceIssueCatalogFindUniqueSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogFindUniqueArgs> = z.object({ select: technicalAppearanceIssueCatalogSelectObjectSchema.optional(),  where: technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogFindUniqueArgs>;

export const technicalAppearanceIssueCatalogFindUniqueZodSchema = z.object({ select: technicalAppearanceIssueCatalogSelectObjectSchema.optional(),  where: technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema }).strict();
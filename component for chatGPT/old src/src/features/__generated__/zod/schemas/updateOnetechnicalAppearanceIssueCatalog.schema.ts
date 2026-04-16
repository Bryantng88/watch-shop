import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAppearanceIssueCatalogSelectObjectSchema as technicalAppearanceIssueCatalogSelectObjectSchema } from './objects/technicalAppearanceIssueCatalogSelect.schema';
import { technicalAppearanceIssueCatalogUpdateInputObjectSchema as technicalAppearanceIssueCatalogUpdateInputObjectSchema } from './objects/technicalAppearanceIssueCatalogUpdateInput.schema';
import { technicalAppearanceIssueCatalogUncheckedUpdateInputObjectSchema as technicalAppearanceIssueCatalogUncheckedUpdateInputObjectSchema } from './objects/technicalAppearanceIssueCatalogUncheckedUpdateInput.schema';
import { technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema as technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema } from './objects/technicalAppearanceIssueCatalogWhereUniqueInput.schema';

export const technicalAppearanceIssueCatalogUpdateOneSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogUpdateArgs> = z.object({ select: technicalAppearanceIssueCatalogSelectObjectSchema.optional(),  data: z.union([technicalAppearanceIssueCatalogUpdateInputObjectSchema, technicalAppearanceIssueCatalogUncheckedUpdateInputObjectSchema]), where: technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogUpdateArgs>;

export const technicalAppearanceIssueCatalogUpdateOneZodSchema = z.object({ select: technicalAppearanceIssueCatalogSelectObjectSchema.optional(),  data: z.union([technicalAppearanceIssueCatalogUpdateInputObjectSchema, technicalAppearanceIssueCatalogUncheckedUpdateInputObjectSchema]), where: technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema }).strict();
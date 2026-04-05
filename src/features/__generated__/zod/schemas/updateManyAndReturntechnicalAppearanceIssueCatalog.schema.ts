import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAppearanceIssueCatalogSelectObjectSchema as technicalAppearanceIssueCatalogSelectObjectSchema } from './objects/technicalAppearanceIssueCatalogSelect.schema';
import { technicalAppearanceIssueCatalogUpdateManyMutationInputObjectSchema as technicalAppearanceIssueCatalogUpdateManyMutationInputObjectSchema } from './objects/technicalAppearanceIssueCatalogUpdateManyMutationInput.schema';
import { technicalAppearanceIssueCatalogWhereInputObjectSchema as technicalAppearanceIssueCatalogWhereInputObjectSchema } from './objects/technicalAppearanceIssueCatalogWhereInput.schema';

export const technicalAppearanceIssueCatalogUpdateManyAndReturnSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogUpdateManyAndReturnArgs> = z.object({ select: technicalAppearanceIssueCatalogSelectObjectSchema.optional(), data: technicalAppearanceIssueCatalogUpdateManyMutationInputObjectSchema, where: technicalAppearanceIssueCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogUpdateManyAndReturnArgs>;

export const technicalAppearanceIssueCatalogUpdateManyAndReturnZodSchema = z.object({ select: technicalAppearanceIssueCatalogSelectObjectSchema.optional(), data: technicalAppearanceIssueCatalogUpdateManyMutationInputObjectSchema, where: technicalAppearanceIssueCatalogWhereInputObjectSchema.optional() }).strict();
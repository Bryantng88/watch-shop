import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAppearanceIssueCatalogUpdateManyMutationInputObjectSchema as technicalAppearanceIssueCatalogUpdateManyMutationInputObjectSchema } from './objects/technicalAppearanceIssueCatalogUpdateManyMutationInput.schema';
import { technicalAppearanceIssueCatalogWhereInputObjectSchema as technicalAppearanceIssueCatalogWhereInputObjectSchema } from './objects/technicalAppearanceIssueCatalogWhereInput.schema';

export const technicalAppearanceIssueCatalogUpdateManySchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogUpdateManyArgs> = z.object({ data: technicalAppearanceIssueCatalogUpdateManyMutationInputObjectSchema, where: technicalAppearanceIssueCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogUpdateManyArgs>;

export const technicalAppearanceIssueCatalogUpdateManyZodSchema = z.object({ data: technicalAppearanceIssueCatalogUpdateManyMutationInputObjectSchema, where: technicalAppearanceIssueCatalogWhereInputObjectSchema.optional() }).strict();
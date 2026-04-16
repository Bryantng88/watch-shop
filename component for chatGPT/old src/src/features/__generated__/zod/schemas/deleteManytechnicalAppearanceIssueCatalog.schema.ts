import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAppearanceIssueCatalogWhereInputObjectSchema as technicalAppearanceIssueCatalogWhereInputObjectSchema } from './objects/technicalAppearanceIssueCatalogWhereInput.schema';

export const technicalAppearanceIssueCatalogDeleteManySchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogDeleteManyArgs> = z.object({ where: technicalAppearanceIssueCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogDeleteManyArgs>;

export const technicalAppearanceIssueCatalogDeleteManyZodSchema = z.object({ where: technicalAppearanceIssueCatalogWhereInputObjectSchema.optional() }).strict();
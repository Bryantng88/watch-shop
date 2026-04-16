import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAppearanceIssueCatalogSelectObjectSchema as technicalAppearanceIssueCatalogSelectObjectSchema } from './objects/technicalAppearanceIssueCatalogSelect.schema';
import { technicalAppearanceIssueCatalogCreateInputObjectSchema as technicalAppearanceIssueCatalogCreateInputObjectSchema } from './objects/technicalAppearanceIssueCatalogCreateInput.schema';
import { technicalAppearanceIssueCatalogUncheckedCreateInputObjectSchema as technicalAppearanceIssueCatalogUncheckedCreateInputObjectSchema } from './objects/technicalAppearanceIssueCatalogUncheckedCreateInput.schema';

export const technicalAppearanceIssueCatalogCreateOneSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogCreateArgs> = z.object({ select: technicalAppearanceIssueCatalogSelectObjectSchema.optional(),  data: z.union([technicalAppearanceIssueCatalogCreateInputObjectSchema, technicalAppearanceIssueCatalogUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogCreateArgs>;

export const technicalAppearanceIssueCatalogCreateOneZodSchema = z.object({ select: technicalAppearanceIssueCatalogSelectObjectSchema.optional(),  data: z.union([technicalAppearanceIssueCatalogCreateInputObjectSchema, technicalAppearanceIssueCatalogUncheckedCreateInputObjectSchema]) }).strict();
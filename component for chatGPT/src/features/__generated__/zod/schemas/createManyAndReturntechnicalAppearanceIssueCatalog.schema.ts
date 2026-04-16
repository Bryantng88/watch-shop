import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAppearanceIssueCatalogSelectObjectSchema as technicalAppearanceIssueCatalogSelectObjectSchema } from './objects/technicalAppearanceIssueCatalogSelect.schema';
import { technicalAppearanceIssueCatalogCreateManyInputObjectSchema as technicalAppearanceIssueCatalogCreateManyInputObjectSchema } from './objects/technicalAppearanceIssueCatalogCreateManyInput.schema';

export const technicalAppearanceIssueCatalogCreateManyAndReturnSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogCreateManyAndReturnArgs> = z.object({ select: technicalAppearanceIssueCatalogSelectObjectSchema.optional(), data: z.union([ technicalAppearanceIssueCatalogCreateManyInputObjectSchema, z.array(technicalAppearanceIssueCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogCreateManyAndReturnArgs>;

export const technicalAppearanceIssueCatalogCreateManyAndReturnZodSchema = z.object({ select: technicalAppearanceIssueCatalogSelectObjectSchema.optional(), data: z.union([ technicalAppearanceIssueCatalogCreateManyInputObjectSchema, z.array(technicalAppearanceIssueCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
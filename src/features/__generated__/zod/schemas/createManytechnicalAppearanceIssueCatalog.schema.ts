import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAppearanceIssueCatalogCreateManyInputObjectSchema as technicalAppearanceIssueCatalogCreateManyInputObjectSchema } from './objects/technicalAppearanceIssueCatalogCreateManyInput.schema';

export const technicalAppearanceIssueCatalogCreateManySchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogCreateManyArgs> = z.object({ data: z.union([ technicalAppearanceIssueCatalogCreateManyInputObjectSchema, z.array(technicalAppearanceIssueCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogCreateManyArgs>;

export const technicalAppearanceIssueCatalogCreateManyZodSchema = z.object({ data: z.union([ technicalAppearanceIssueCatalogCreateManyInputObjectSchema, z.array(technicalAppearanceIssueCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
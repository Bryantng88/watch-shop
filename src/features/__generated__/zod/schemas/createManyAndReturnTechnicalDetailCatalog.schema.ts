import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalDetailCatalogSelectObjectSchema as TechnicalDetailCatalogSelectObjectSchema } from './objects/TechnicalDetailCatalogSelect.schema';
import { TechnicalDetailCatalogCreateManyInputObjectSchema as TechnicalDetailCatalogCreateManyInputObjectSchema } from './objects/TechnicalDetailCatalogCreateManyInput.schema';

export const TechnicalDetailCatalogCreateManyAndReturnSchema: z.ZodType<Prisma.TechnicalDetailCatalogCreateManyAndReturnArgs> = z.object({ select: TechnicalDetailCatalogSelectObjectSchema.optional(), data: z.union([ TechnicalDetailCatalogCreateManyInputObjectSchema, z.array(TechnicalDetailCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogCreateManyAndReturnArgs>;

export const TechnicalDetailCatalogCreateManyAndReturnZodSchema = z.object({ select: TechnicalDetailCatalogSelectObjectSchema.optional(), data: z.union([ TechnicalDetailCatalogCreateManyInputObjectSchema, z.array(TechnicalDetailCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
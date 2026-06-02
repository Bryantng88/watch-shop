import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalDetailCatalogCreateManyInputObjectSchema as TechnicalDetailCatalogCreateManyInputObjectSchema } from './objects/TechnicalDetailCatalogCreateManyInput.schema';

export const TechnicalDetailCatalogCreateManySchema: z.ZodType<Prisma.TechnicalDetailCatalogCreateManyArgs> = z.object({ data: z.union([ TechnicalDetailCatalogCreateManyInputObjectSchema, z.array(TechnicalDetailCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogCreateManyArgs>;

export const TechnicalDetailCatalogCreateManyZodSchema = z.object({ data: z.union([ TechnicalDetailCatalogCreateManyInputObjectSchema, z.array(TechnicalDetailCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
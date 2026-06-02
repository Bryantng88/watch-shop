import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalDetailCatalogWhereInputObjectSchema as TechnicalDetailCatalogWhereInputObjectSchema } from './objects/TechnicalDetailCatalogWhereInput.schema';

export const TechnicalDetailCatalogDeleteManySchema: z.ZodType<Prisma.TechnicalDetailCatalogDeleteManyArgs> = z.object({ where: TechnicalDetailCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogDeleteManyArgs>;

export const TechnicalDetailCatalogDeleteManyZodSchema = z.object({ where: TechnicalDetailCatalogWhereInputObjectSchema.optional() }).strict();
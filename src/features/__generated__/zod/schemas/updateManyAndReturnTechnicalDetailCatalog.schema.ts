import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalDetailCatalogSelectObjectSchema as TechnicalDetailCatalogSelectObjectSchema } from './objects/TechnicalDetailCatalogSelect.schema';
import { TechnicalDetailCatalogUpdateManyMutationInputObjectSchema as TechnicalDetailCatalogUpdateManyMutationInputObjectSchema } from './objects/TechnicalDetailCatalogUpdateManyMutationInput.schema';
import { TechnicalDetailCatalogWhereInputObjectSchema as TechnicalDetailCatalogWhereInputObjectSchema } from './objects/TechnicalDetailCatalogWhereInput.schema';

export const TechnicalDetailCatalogUpdateManyAndReturnSchema: z.ZodType<Prisma.TechnicalDetailCatalogUpdateManyAndReturnArgs> = z.object({ select: TechnicalDetailCatalogSelectObjectSchema.optional(), data: TechnicalDetailCatalogUpdateManyMutationInputObjectSchema, where: TechnicalDetailCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogUpdateManyAndReturnArgs>;

export const TechnicalDetailCatalogUpdateManyAndReturnZodSchema = z.object({ select: TechnicalDetailCatalogSelectObjectSchema.optional(), data: TechnicalDetailCatalogUpdateManyMutationInputObjectSchema, where: TechnicalDetailCatalogWhereInputObjectSchema.optional() }).strict();
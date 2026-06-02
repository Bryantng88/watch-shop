import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalDetailCatalogSelectObjectSchema as TechnicalDetailCatalogSelectObjectSchema } from './objects/TechnicalDetailCatalogSelect.schema';
import { TechnicalDetailCatalogIncludeObjectSchema as TechnicalDetailCatalogIncludeObjectSchema } from './objects/TechnicalDetailCatalogInclude.schema';
import { TechnicalDetailCatalogUpdateInputObjectSchema as TechnicalDetailCatalogUpdateInputObjectSchema } from './objects/TechnicalDetailCatalogUpdateInput.schema';
import { TechnicalDetailCatalogUncheckedUpdateInputObjectSchema as TechnicalDetailCatalogUncheckedUpdateInputObjectSchema } from './objects/TechnicalDetailCatalogUncheckedUpdateInput.schema';
import { TechnicalDetailCatalogWhereUniqueInputObjectSchema as TechnicalDetailCatalogWhereUniqueInputObjectSchema } from './objects/TechnicalDetailCatalogWhereUniqueInput.schema';

export const TechnicalDetailCatalogUpdateOneSchema: z.ZodType<Prisma.TechnicalDetailCatalogUpdateArgs> = z.object({ select: TechnicalDetailCatalogSelectObjectSchema.optional(), include: TechnicalDetailCatalogIncludeObjectSchema.optional(), data: z.union([TechnicalDetailCatalogUpdateInputObjectSchema, TechnicalDetailCatalogUncheckedUpdateInputObjectSchema]), where: TechnicalDetailCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogUpdateArgs>;

export const TechnicalDetailCatalogUpdateOneZodSchema = z.object({ select: TechnicalDetailCatalogSelectObjectSchema.optional(), include: TechnicalDetailCatalogIncludeObjectSchema.optional(), data: z.union([TechnicalDetailCatalogUpdateInputObjectSchema, TechnicalDetailCatalogUncheckedUpdateInputObjectSchema]), where: TechnicalDetailCatalogWhereUniqueInputObjectSchema }).strict();
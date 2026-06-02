import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalDetailCatalogSelectObjectSchema as TechnicalDetailCatalogSelectObjectSchema } from './objects/TechnicalDetailCatalogSelect.schema';
import { TechnicalDetailCatalogIncludeObjectSchema as TechnicalDetailCatalogIncludeObjectSchema } from './objects/TechnicalDetailCatalogInclude.schema';
import { TechnicalDetailCatalogWhereUniqueInputObjectSchema as TechnicalDetailCatalogWhereUniqueInputObjectSchema } from './objects/TechnicalDetailCatalogWhereUniqueInput.schema';

export const TechnicalDetailCatalogFindUniqueSchema: z.ZodType<Prisma.TechnicalDetailCatalogFindUniqueArgs> = z.object({ select: TechnicalDetailCatalogSelectObjectSchema.optional(), include: TechnicalDetailCatalogIncludeObjectSchema.optional(), where: TechnicalDetailCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogFindUniqueArgs>;

export const TechnicalDetailCatalogFindUniqueZodSchema = z.object({ select: TechnicalDetailCatalogSelectObjectSchema.optional(), include: TechnicalDetailCatalogIncludeObjectSchema.optional(), where: TechnicalDetailCatalogWhereUniqueInputObjectSchema }).strict();
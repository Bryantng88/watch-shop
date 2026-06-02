import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalDetailCatalogSelectObjectSchema as TechnicalDetailCatalogSelectObjectSchema } from './objects/TechnicalDetailCatalogSelect.schema';
import { TechnicalDetailCatalogIncludeObjectSchema as TechnicalDetailCatalogIncludeObjectSchema } from './objects/TechnicalDetailCatalogInclude.schema';
import { TechnicalDetailCatalogCreateInputObjectSchema as TechnicalDetailCatalogCreateInputObjectSchema } from './objects/TechnicalDetailCatalogCreateInput.schema';
import { TechnicalDetailCatalogUncheckedCreateInputObjectSchema as TechnicalDetailCatalogUncheckedCreateInputObjectSchema } from './objects/TechnicalDetailCatalogUncheckedCreateInput.schema';

export const TechnicalDetailCatalogCreateOneSchema: z.ZodType<Prisma.TechnicalDetailCatalogCreateArgs> = z.object({ select: TechnicalDetailCatalogSelectObjectSchema.optional(), include: TechnicalDetailCatalogIncludeObjectSchema.optional(), data: z.union([TechnicalDetailCatalogCreateInputObjectSchema, TechnicalDetailCatalogUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogCreateArgs>;

export const TechnicalDetailCatalogCreateOneZodSchema = z.object({ select: TechnicalDetailCatalogSelectObjectSchema.optional(), include: TechnicalDetailCatalogIncludeObjectSchema.optional(), data: z.union([TechnicalDetailCatalogCreateInputObjectSchema, TechnicalDetailCatalogUncheckedCreateInputObjectSchema]) }).strict();
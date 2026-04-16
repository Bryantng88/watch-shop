import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalPartCatalogSelectObjectSchema as technicalPartCatalogSelectObjectSchema } from './objects/technicalPartCatalogSelect.schema';
import { technicalPartCatalogCreateInputObjectSchema as technicalPartCatalogCreateInputObjectSchema } from './objects/technicalPartCatalogCreateInput.schema';
import { technicalPartCatalogUncheckedCreateInputObjectSchema as technicalPartCatalogUncheckedCreateInputObjectSchema } from './objects/technicalPartCatalogUncheckedCreateInput.schema';

export const technicalPartCatalogCreateOneSchema: z.ZodType<Prisma.technicalPartCatalogCreateArgs> = z.object({ select: technicalPartCatalogSelectObjectSchema.optional(),  data: z.union([technicalPartCatalogCreateInputObjectSchema, technicalPartCatalogUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.technicalPartCatalogCreateArgs>;

export const technicalPartCatalogCreateOneZodSchema = z.object({ select: technicalPartCatalogSelectObjectSchema.optional(),  data: z.union([technicalPartCatalogCreateInputObjectSchema, technicalPartCatalogUncheckedCreateInputObjectSchema]) }).strict();
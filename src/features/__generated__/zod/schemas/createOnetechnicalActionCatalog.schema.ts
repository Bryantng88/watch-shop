import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalActionCatalogSelectObjectSchema as technicalActionCatalogSelectObjectSchema } from './objects/technicalActionCatalogSelect.schema';
import { technicalActionCatalogCreateInputObjectSchema as technicalActionCatalogCreateInputObjectSchema } from './objects/technicalActionCatalogCreateInput.schema';
import { technicalActionCatalogUncheckedCreateInputObjectSchema as technicalActionCatalogUncheckedCreateInputObjectSchema } from './objects/technicalActionCatalogUncheckedCreateInput.schema';

export const technicalActionCatalogCreateOneSchema: z.ZodType<Prisma.technicalActionCatalogCreateArgs> = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(),  data: z.union([technicalActionCatalogCreateInputObjectSchema, technicalActionCatalogUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.technicalActionCatalogCreateArgs>;

export const technicalActionCatalogCreateOneZodSchema = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(),  data: z.union([technicalActionCatalogCreateInputObjectSchema, technicalActionCatalogUncheckedCreateInputObjectSchema]) }).strict();
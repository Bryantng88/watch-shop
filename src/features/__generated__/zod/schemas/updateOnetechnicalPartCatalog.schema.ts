import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalPartCatalogSelectObjectSchema as technicalPartCatalogSelectObjectSchema } from './objects/technicalPartCatalogSelect.schema';
import { technicalPartCatalogUpdateInputObjectSchema as technicalPartCatalogUpdateInputObjectSchema } from './objects/technicalPartCatalogUpdateInput.schema';
import { technicalPartCatalogUncheckedUpdateInputObjectSchema as technicalPartCatalogUncheckedUpdateInputObjectSchema } from './objects/technicalPartCatalogUncheckedUpdateInput.schema';
import { technicalPartCatalogWhereUniqueInputObjectSchema as technicalPartCatalogWhereUniqueInputObjectSchema } from './objects/technicalPartCatalogWhereUniqueInput.schema';

export const technicalPartCatalogUpdateOneSchema: z.ZodType<Prisma.technicalPartCatalogUpdateArgs> = z.object({ select: technicalPartCatalogSelectObjectSchema.optional(),  data: z.union([technicalPartCatalogUpdateInputObjectSchema, technicalPartCatalogUncheckedUpdateInputObjectSchema]), where: technicalPartCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.technicalPartCatalogUpdateArgs>;

export const technicalPartCatalogUpdateOneZodSchema = z.object({ select: technicalPartCatalogSelectObjectSchema.optional(),  data: z.union([technicalPartCatalogUpdateInputObjectSchema, technicalPartCatalogUncheckedUpdateInputObjectSchema]), where: technicalPartCatalogWhereUniqueInputObjectSchema }).strict();
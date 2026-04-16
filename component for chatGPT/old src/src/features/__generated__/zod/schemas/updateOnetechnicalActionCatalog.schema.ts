import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalActionCatalogSelectObjectSchema as technicalActionCatalogSelectObjectSchema } from './objects/technicalActionCatalogSelect.schema';
import { technicalActionCatalogUpdateInputObjectSchema as technicalActionCatalogUpdateInputObjectSchema } from './objects/technicalActionCatalogUpdateInput.schema';
import { technicalActionCatalogUncheckedUpdateInputObjectSchema as technicalActionCatalogUncheckedUpdateInputObjectSchema } from './objects/technicalActionCatalogUncheckedUpdateInput.schema';
import { technicalActionCatalogWhereUniqueInputObjectSchema as technicalActionCatalogWhereUniqueInputObjectSchema } from './objects/technicalActionCatalogWhereUniqueInput.schema';

export const technicalActionCatalogUpdateOneSchema: z.ZodType<Prisma.technicalActionCatalogUpdateArgs> = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(),  data: z.union([technicalActionCatalogUpdateInputObjectSchema, technicalActionCatalogUncheckedUpdateInputObjectSchema]), where: technicalActionCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.technicalActionCatalogUpdateArgs>;

export const technicalActionCatalogUpdateOneZodSchema = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(),  data: z.union([technicalActionCatalogUpdateInputObjectSchema, technicalActionCatalogUncheckedUpdateInputObjectSchema]), where: technicalActionCatalogWhereUniqueInputObjectSchema }).strict();
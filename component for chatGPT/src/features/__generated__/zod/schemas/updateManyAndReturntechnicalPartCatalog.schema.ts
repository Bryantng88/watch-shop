import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalPartCatalogSelectObjectSchema as technicalPartCatalogSelectObjectSchema } from './objects/technicalPartCatalogSelect.schema';
import { technicalPartCatalogUpdateManyMutationInputObjectSchema as technicalPartCatalogUpdateManyMutationInputObjectSchema } from './objects/technicalPartCatalogUpdateManyMutationInput.schema';
import { technicalPartCatalogWhereInputObjectSchema as technicalPartCatalogWhereInputObjectSchema } from './objects/technicalPartCatalogWhereInput.schema';

export const technicalPartCatalogUpdateManyAndReturnSchema: z.ZodType<Prisma.technicalPartCatalogUpdateManyAndReturnArgs> = z.object({ select: technicalPartCatalogSelectObjectSchema.optional(), data: technicalPartCatalogUpdateManyMutationInputObjectSchema, where: technicalPartCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.technicalPartCatalogUpdateManyAndReturnArgs>;

export const technicalPartCatalogUpdateManyAndReturnZodSchema = z.object({ select: technicalPartCatalogSelectObjectSchema.optional(), data: technicalPartCatalogUpdateManyMutationInputObjectSchema, where: technicalPartCatalogWhereInputObjectSchema.optional() }).strict();
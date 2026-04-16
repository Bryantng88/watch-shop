import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalPartCatalogSelectObjectSchema as technicalPartCatalogSelectObjectSchema } from './objects/technicalPartCatalogSelect.schema';
import { technicalPartCatalogWhereUniqueInputObjectSchema as technicalPartCatalogWhereUniqueInputObjectSchema } from './objects/technicalPartCatalogWhereUniqueInput.schema';

export const technicalPartCatalogFindUniqueSchema: z.ZodType<Prisma.technicalPartCatalogFindUniqueArgs> = z.object({ select: technicalPartCatalogSelectObjectSchema.optional(),  where: technicalPartCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.technicalPartCatalogFindUniqueArgs>;

export const technicalPartCatalogFindUniqueZodSchema = z.object({ select: technicalPartCatalogSelectObjectSchema.optional(),  where: technicalPartCatalogWhereUniqueInputObjectSchema }).strict();
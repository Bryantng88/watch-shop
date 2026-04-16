import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalPartCatalogSelectObjectSchema as technicalPartCatalogSelectObjectSchema } from './objects/technicalPartCatalogSelect.schema';
import { technicalPartCatalogWhereUniqueInputObjectSchema as technicalPartCatalogWhereUniqueInputObjectSchema } from './objects/technicalPartCatalogWhereUniqueInput.schema';

export const technicalPartCatalogFindUniqueOrThrowSchema: z.ZodType<Prisma.technicalPartCatalogFindUniqueOrThrowArgs> = z.object({ select: technicalPartCatalogSelectObjectSchema.optional(),  where: technicalPartCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.technicalPartCatalogFindUniqueOrThrowArgs>;

export const technicalPartCatalogFindUniqueOrThrowZodSchema = z.object({ select: technicalPartCatalogSelectObjectSchema.optional(),  where: technicalPartCatalogWhereUniqueInputObjectSchema }).strict();
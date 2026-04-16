import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalActionCatalogSelectObjectSchema as technicalActionCatalogSelectObjectSchema } from './objects/technicalActionCatalogSelect.schema';
import { technicalActionCatalogWhereUniqueInputObjectSchema as technicalActionCatalogWhereUniqueInputObjectSchema } from './objects/technicalActionCatalogWhereUniqueInput.schema';

export const technicalActionCatalogFindUniqueSchema: z.ZodType<Prisma.technicalActionCatalogFindUniqueArgs> = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(),  where: technicalActionCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.technicalActionCatalogFindUniqueArgs>;

export const technicalActionCatalogFindUniqueZodSchema = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(),  where: technicalActionCatalogWhereUniqueInputObjectSchema }).strict();
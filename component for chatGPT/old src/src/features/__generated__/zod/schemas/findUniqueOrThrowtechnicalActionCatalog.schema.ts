import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalActionCatalogSelectObjectSchema as technicalActionCatalogSelectObjectSchema } from './objects/technicalActionCatalogSelect.schema';
import { technicalActionCatalogWhereUniqueInputObjectSchema as technicalActionCatalogWhereUniqueInputObjectSchema } from './objects/technicalActionCatalogWhereUniqueInput.schema';

export const technicalActionCatalogFindUniqueOrThrowSchema: z.ZodType<Prisma.technicalActionCatalogFindUniqueOrThrowArgs> = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(),  where: technicalActionCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.technicalActionCatalogFindUniqueOrThrowArgs>;

export const technicalActionCatalogFindUniqueOrThrowZodSchema = z.object({ select: technicalActionCatalogSelectObjectSchema.optional(),  where: technicalActionCatalogWhereUniqueInputObjectSchema }).strict();
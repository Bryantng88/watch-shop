import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalPartCatalogWhereInputObjectSchema as technicalPartCatalogWhereInputObjectSchema } from './objects/technicalPartCatalogWhereInput.schema';

export const technicalPartCatalogDeleteManySchema: z.ZodType<Prisma.technicalPartCatalogDeleteManyArgs> = z.object({ where: technicalPartCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.technicalPartCatalogDeleteManyArgs>;

export const technicalPartCatalogDeleteManyZodSchema = z.object({ where: technicalPartCatalogWhereInputObjectSchema.optional() }).strict();
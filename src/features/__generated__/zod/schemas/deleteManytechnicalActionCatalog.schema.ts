import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalActionCatalogWhereInputObjectSchema as technicalActionCatalogWhereInputObjectSchema } from './objects/technicalActionCatalogWhereInput.schema';

export const technicalActionCatalogDeleteManySchema: z.ZodType<Prisma.technicalActionCatalogDeleteManyArgs> = z.object({ where: technicalActionCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.technicalActionCatalogDeleteManyArgs>;

export const technicalActionCatalogDeleteManyZodSchema = z.object({ where: technicalActionCatalogWhereInputObjectSchema.optional() }).strict();
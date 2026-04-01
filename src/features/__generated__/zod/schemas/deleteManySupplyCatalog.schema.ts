import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SupplyCatalogWhereInputObjectSchema as SupplyCatalogWhereInputObjectSchema } from './objects/SupplyCatalogWhereInput.schema';

export const SupplyCatalogDeleteManySchema: z.ZodType<Prisma.SupplyCatalogDeleteManyArgs> = z.object({ where: SupplyCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SupplyCatalogDeleteManyArgs>;

export const SupplyCatalogDeleteManyZodSchema = z.object({ where: SupplyCatalogWhereInputObjectSchema.optional() }).strict();
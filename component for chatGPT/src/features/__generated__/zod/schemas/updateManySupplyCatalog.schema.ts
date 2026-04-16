import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SupplyCatalogUpdateManyMutationInputObjectSchema as SupplyCatalogUpdateManyMutationInputObjectSchema } from './objects/SupplyCatalogUpdateManyMutationInput.schema';
import { SupplyCatalogWhereInputObjectSchema as SupplyCatalogWhereInputObjectSchema } from './objects/SupplyCatalogWhereInput.schema';

export const SupplyCatalogUpdateManySchema: z.ZodType<Prisma.SupplyCatalogUpdateManyArgs> = z.object({ data: SupplyCatalogUpdateManyMutationInputObjectSchema, where: SupplyCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SupplyCatalogUpdateManyArgs>;

export const SupplyCatalogUpdateManyZodSchema = z.object({ data: SupplyCatalogUpdateManyMutationInputObjectSchema, where: SupplyCatalogWhereInputObjectSchema.optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SupplyCatalogSelectObjectSchema as SupplyCatalogSelectObjectSchema } from './objects/SupplyCatalogSelect.schema';
import { SupplyCatalogUpdateManyMutationInputObjectSchema as SupplyCatalogUpdateManyMutationInputObjectSchema } from './objects/SupplyCatalogUpdateManyMutationInput.schema';
import { SupplyCatalogWhereInputObjectSchema as SupplyCatalogWhereInputObjectSchema } from './objects/SupplyCatalogWhereInput.schema';

export const SupplyCatalogUpdateManyAndReturnSchema: z.ZodType<Prisma.SupplyCatalogUpdateManyAndReturnArgs> = z.object({ select: SupplyCatalogSelectObjectSchema.optional(), data: SupplyCatalogUpdateManyMutationInputObjectSchema, where: SupplyCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SupplyCatalogUpdateManyAndReturnArgs>;

export const SupplyCatalogUpdateManyAndReturnZodSchema = z.object({ select: SupplyCatalogSelectObjectSchema.optional(), data: SupplyCatalogUpdateManyMutationInputObjectSchema, where: SupplyCatalogWhereInputObjectSchema.optional() }).strict();
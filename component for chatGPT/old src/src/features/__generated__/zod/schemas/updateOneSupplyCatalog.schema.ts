import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SupplyCatalogSelectObjectSchema as SupplyCatalogSelectObjectSchema } from './objects/SupplyCatalogSelect.schema';
import { SupplyCatalogIncludeObjectSchema as SupplyCatalogIncludeObjectSchema } from './objects/SupplyCatalogInclude.schema';
import { SupplyCatalogUpdateInputObjectSchema as SupplyCatalogUpdateInputObjectSchema } from './objects/SupplyCatalogUpdateInput.schema';
import { SupplyCatalogUncheckedUpdateInputObjectSchema as SupplyCatalogUncheckedUpdateInputObjectSchema } from './objects/SupplyCatalogUncheckedUpdateInput.schema';
import { SupplyCatalogWhereUniqueInputObjectSchema as SupplyCatalogWhereUniqueInputObjectSchema } from './objects/SupplyCatalogWhereUniqueInput.schema';

export const SupplyCatalogUpdateOneSchema: z.ZodType<Prisma.SupplyCatalogUpdateArgs> = z.object({ select: SupplyCatalogSelectObjectSchema.optional(), include: SupplyCatalogIncludeObjectSchema.optional(), data: z.union([SupplyCatalogUpdateInputObjectSchema, SupplyCatalogUncheckedUpdateInputObjectSchema]), where: SupplyCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SupplyCatalogUpdateArgs>;

export const SupplyCatalogUpdateOneZodSchema = z.object({ select: SupplyCatalogSelectObjectSchema.optional(), include: SupplyCatalogIncludeObjectSchema.optional(), data: z.union([SupplyCatalogUpdateInputObjectSchema, SupplyCatalogUncheckedUpdateInputObjectSchema]), where: SupplyCatalogWhereUniqueInputObjectSchema }).strict();
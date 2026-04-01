import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SupplyCatalogSelectObjectSchema as SupplyCatalogSelectObjectSchema } from './objects/SupplyCatalogSelect.schema';
import { SupplyCatalogIncludeObjectSchema as SupplyCatalogIncludeObjectSchema } from './objects/SupplyCatalogInclude.schema';
import { SupplyCatalogWhereUniqueInputObjectSchema as SupplyCatalogWhereUniqueInputObjectSchema } from './objects/SupplyCatalogWhereUniqueInput.schema';

export const SupplyCatalogFindUniqueSchema: z.ZodType<Prisma.SupplyCatalogFindUniqueArgs> = z.object({ select: SupplyCatalogSelectObjectSchema.optional(), include: SupplyCatalogIncludeObjectSchema.optional(), where: SupplyCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SupplyCatalogFindUniqueArgs>;

export const SupplyCatalogFindUniqueZodSchema = z.object({ select: SupplyCatalogSelectObjectSchema.optional(), include: SupplyCatalogIncludeObjectSchema.optional(), where: SupplyCatalogWhereUniqueInputObjectSchema }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SupplyCatalogSelectObjectSchema as SupplyCatalogSelectObjectSchema } from './objects/SupplyCatalogSelect.schema';
import { SupplyCatalogIncludeObjectSchema as SupplyCatalogIncludeObjectSchema } from './objects/SupplyCatalogInclude.schema';
import { SupplyCatalogCreateInputObjectSchema as SupplyCatalogCreateInputObjectSchema } from './objects/SupplyCatalogCreateInput.schema';
import { SupplyCatalogUncheckedCreateInputObjectSchema as SupplyCatalogUncheckedCreateInputObjectSchema } from './objects/SupplyCatalogUncheckedCreateInput.schema';

export const SupplyCatalogCreateOneSchema: z.ZodType<Prisma.SupplyCatalogCreateArgs> = z.object({ select: SupplyCatalogSelectObjectSchema.optional(), include: SupplyCatalogIncludeObjectSchema.optional(), data: z.union([SupplyCatalogCreateInputObjectSchema, SupplyCatalogUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.SupplyCatalogCreateArgs>;

export const SupplyCatalogCreateOneZodSchema = z.object({ select: SupplyCatalogSelectObjectSchema.optional(), include: SupplyCatalogIncludeObjectSchema.optional(), data: z.union([SupplyCatalogCreateInputObjectSchema, SupplyCatalogUncheckedCreateInputObjectSchema]) }).strict();
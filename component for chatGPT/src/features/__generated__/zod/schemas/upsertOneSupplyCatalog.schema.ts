import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SupplyCatalogSelectObjectSchema as SupplyCatalogSelectObjectSchema } from './objects/SupplyCatalogSelect.schema';
import { SupplyCatalogIncludeObjectSchema as SupplyCatalogIncludeObjectSchema } from './objects/SupplyCatalogInclude.schema';
import { SupplyCatalogWhereUniqueInputObjectSchema as SupplyCatalogWhereUniqueInputObjectSchema } from './objects/SupplyCatalogWhereUniqueInput.schema';
import { SupplyCatalogCreateInputObjectSchema as SupplyCatalogCreateInputObjectSchema } from './objects/SupplyCatalogCreateInput.schema';
import { SupplyCatalogUncheckedCreateInputObjectSchema as SupplyCatalogUncheckedCreateInputObjectSchema } from './objects/SupplyCatalogUncheckedCreateInput.schema';
import { SupplyCatalogUpdateInputObjectSchema as SupplyCatalogUpdateInputObjectSchema } from './objects/SupplyCatalogUpdateInput.schema';
import { SupplyCatalogUncheckedUpdateInputObjectSchema as SupplyCatalogUncheckedUpdateInputObjectSchema } from './objects/SupplyCatalogUncheckedUpdateInput.schema';

export const SupplyCatalogUpsertOneSchema: z.ZodType<Prisma.SupplyCatalogUpsertArgs> = z.object({ select: SupplyCatalogSelectObjectSchema.optional(), include: SupplyCatalogIncludeObjectSchema.optional(), where: SupplyCatalogWhereUniqueInputObjectSchema, create: z.union([ SupplyCatalogCreateInputObjectSchema, SupplyCatalogUncheckedCreateInputObjectSchema ]), update: z.union([ SupplyCatalogUpdateInputObjectSchema, SupplyCatalogUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.SupplyCatalogUpsertArgs>;

export const SupplyCatalogUpsertOneZodSchema = z.object({ select: SupplyCatalogSelectObjectSchema.optional(), include: SupplyCatalogIncludeObjectSchema.optional(), where: SupplyCatalogWhereUniqueInputObjectSchema, create: z.union([ SupplyCatalogCreateInputObjectSchema, SupplyCatalogUncheckedCreateInputObjectSchema ]), update: z.union([ SupplyCatalogUpdateInputObjectSchema, SupplyCatalogUncheckedUpdateInputObjectSchema ]) }).strict();
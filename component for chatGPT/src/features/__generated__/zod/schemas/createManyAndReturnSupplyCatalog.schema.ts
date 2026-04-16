import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SupplyCatalogSelectObjectSchema as SupplyCatalogSelectObjectSchema } from './objects/SupplyCatalogSelect.schema';
import { SupplyCatalogCreateManyInputObjectSchema as SupplyCatalogCreateManyInputObjectSchema } from './objects/SupplyCatalogCreateManyInput.schema';

export const SupplyCatalogCreateManyAndReturnSchema: z.ZodType<Prisma.SupplyCatalogCreateManyAndReturnArgs> = z.object({ select: SupplyCatalogSelectObjectSchema.optional(), data: z.union([ SupplyCatalogCreateManyInputObjectSchema, z.array(SupplyCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SupplyCatalogCreateManyAndReturnArgs>;

export const SupplyCatalogCreateManyAndReturnZodSchema = z.object({ select: SupplyCatalogSelectObjectSchema.optional(), data: z.union([ SupplyCatalogCreateManyInputObjectSchema, z.array(SupplyCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
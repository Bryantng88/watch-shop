import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SupplyCatalogCreateManyInputObjectSchema as SupplyCatalogCreateManyInputObjectSchema } from './objects/SupplyCatalogCreateManyInput.schema';

export const SupplyCatalogCreateManySchema: z.ZodType<Prisma.SupplyCatalogCreateManyArgs> = z.object({ data: z.union([ SupplyCatalogCreateManyInputObjectSchema, z.array(SupplyCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SupplyCatalogCreateManyArgs>;

export const SupplyCatalogCreateManyZodSchema = z.object({ data: z.union([ SupplyCatalogCreateManyInputObjectSchema, z.array(SupplyCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
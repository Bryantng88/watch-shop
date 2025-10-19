import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { VendorCreateManyInputObjectSchema as VendorCreateManyInputObjectSchema } from './objects/VendorCreateManyInput.schema';

export const VendorCreateManySchema: z.ZodType<Prisma.VendorCreateManyArgs> = z.object({ data: z.union([ VendorCreateManyInputObjectSchema, z.array(VendorCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.VendorCreateManyArgs>;

export const VendorCreateManyZodSchema = z.object({ data: z.union([ VendorCreateManyInputObjectSchema, z.array(VendorCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
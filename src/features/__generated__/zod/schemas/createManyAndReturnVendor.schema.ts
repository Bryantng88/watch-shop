import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { VendorSelectObjectSchema as VendorSelectObjectSchema } from './objects/VendorSelect.schema';
import { VendorCreateManyInputObjectSchema as VendorCreateManyInputObjectSchema } from './objects/VendorCreateManyInput.schema';

export const VendorCreateManyAndReturnSchema: z.ZodType<Prisma.VendorCreateManyAndReturnArgs> = z.object({ select: VendorSelectObjectSchema.optional(), data: z.union([ VendorCreateManyInputObjectSchema, z.array(VendorCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.VendorCreateManyAndReturnArgs>;

export const VendorCreateManyAndReturnZodSchema = z.object({ select: VendorSelectObjectSchema.optional(), data: z.union([ VendorCreateManyInputObjectSchema, z.array(VendorCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
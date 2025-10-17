import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => VendorWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => VendorWhereInputObjectSchema).optional().nullable()
}).strict();
export const VendorNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.VendorNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.VendorNullableScalarRelationFilter>;
export const VendorNullableScalarRelationFilterObjectZodSchema = makeSchema();

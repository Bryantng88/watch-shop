import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => VendorWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => VendorWhereInputObjectSchema).optional()
}).strict();
export const VendorScalarRelationFilterObjectSchema: z.ZodType<Prisma.VendorScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.VendorScalarRelationFilter>;
export const VendorScalarRelationFilterObjectZodSchema = makeSchema();

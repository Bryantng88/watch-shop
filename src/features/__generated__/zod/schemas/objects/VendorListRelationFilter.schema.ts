import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => VendorWhereInputObjectSchema).optional(),
  some: z.lazy(() => VendorWhereInputObjectSchema).optional(),
  none: z.lazy(() => VendorWhereInputObjectSchema).optional()
}).strict();
export const VendorListRelationFilterObjectSchema: z.ZodType<Prisma.VendorListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.VendorListRelationFilter>;
export const VendorListRelationFilterObjectZodSchema = makeSchema();

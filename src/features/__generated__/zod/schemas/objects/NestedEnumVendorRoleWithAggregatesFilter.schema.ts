import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumVendorRoleFilterObjectSchema as NestedEnumVendorRoleFilterObjectSchema } from './NestedEnumVendorRoleFilter.schema'

const nestedenumvendorrolewithaggregatesfilterSchema = z.object({
  equals: VendorRoleSchema.optional(),
  in: VendorRoleSchema.array().optional(),
  notIn: VendorRoleSchema.array().optional(),
  not: z.union([VendorRoleSchema, z.lazy(() => NestedEnumVendorRoleWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumVendorRoleFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumVendorRoleFilterObjectSchema).optional()
}).strict();
export const NestedEnumVendorRoleWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumVendorRoleWithAggregatesFilter> = nestedenumvendorrolewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumVendorRoleWithAggregatesFilter>;
export const NestedEnumVendorRoleWithAggregatesFilterObjectZodSchema = nestedenumvendorrolewithaggregatesfilterSchema;

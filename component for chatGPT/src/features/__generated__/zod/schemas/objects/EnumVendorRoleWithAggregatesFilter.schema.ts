import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { NestedEnumVendorRoleWithAggregatesFilterObjectSchema as NestedEnumVendorRoleWithAggregatesFilterObjectSchema } from './NestedEnumVendorRoleWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumVendorRoleFilterObjectSchema as NestedEnumVendorRoleFilterObjectSchema } from './NestedEnumVendorRoleFilter.schema'

const makeSchema = () => z.object({
  equals: VendorRoleSchema.optional(),
  in: VendorRoleSchema.array().optional(),
  notIn: VendorRoleSchema.array().optional(),
  not: z.union([VendorRoleSchema, z.lazy(() => NestedEnumVendorRoleWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumVendorRoleFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumVendorRoleFilterObjectSchema).optional()
}).strict();
export const EnumVendorRoleWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumVendorRoleWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumVendorRoleWithAggregatesFilter>;
export const EnumVendorRoleWithAggregatesFilterObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { NestedEnumVendorRoleFilterObjectSchema as NestedEnumVendorRoleFilterObjectSchema } from './NestedEnumVendorRoleFilter.schema'

const makeSchema = () => z.object({
  equals: VendorRoleSchema.optional(),
  in: VendorRoleSchema.array().optional(),
  notIn: VendorRoleSchema.array().optional(),
  not: z.union([VendorRoleSchema, z.lazy(() => NestedEnumVendorRoleFilterObjectSchema)]).optional()
}).strict();
export const EnumVendorRoleFilterObjectSchema: z.ZodType<Prisma.EnumVendorRoleFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumVendorRoleFilter>;
export const EnumVendorRoleFilterObjectZodSchema = makeSchema();

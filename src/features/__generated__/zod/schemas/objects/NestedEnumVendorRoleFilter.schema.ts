import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema'

const nestedenumvendorrolefilterSchema = z.object({
  equals: VendorRoleSchema.optional(),
  in: VendorRoleSchema.array().optional(),
  notIn: VendorRoleSchema.array().optional(),
  not: z.union([VendorRoleSchema, z.lazy(() => NestedEnumVendorRoleFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumVendorRoleFilterObjectSchema: z.ZodType<Prisma.NestedEnumVendorRoleFilter> = nestedenumvendorrolefilterSchema as unknown as z.ZodType<Prisma.NestedEnumVendorRoleFilter>;
export const NestedEnumVendorRoleFilterObjectZodSchema = nestedenumvendorrolefilterSchema;

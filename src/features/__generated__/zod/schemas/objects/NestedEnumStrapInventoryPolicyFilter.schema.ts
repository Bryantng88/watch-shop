import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryPolicySchema } from '../enums/StrapInventoryPolicy.schema'

const nestedenumstrapinventorypolicyfilterSchema = z.object({
  equals: StrapInventoryPolicySchema.optional(),
  in: StrapInventoryPolicySchema.array().optional(),
  notIn: StrapInventoryPolicySchema.array().optional(),
  not: z.union([StrapInventoryPolicySchema, z.lazy(() => NestedEnumStrapInventoryPolicyFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumStrapInventoryPolicyFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapInventoryPolicyFilter> = nestedenumstrapinventorypolicyfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapInventoryPolicyFilter>;
export const NestedEnumStrapInventoryPolicyFilterObjectZodSchema = nestedenumstrapinventorypolicyfilterSchema;

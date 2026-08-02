import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryPolicySchema } from '../enums/StrapInventoryPolicy.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStrapInventoryPolicyFilterObjectSchema as NestedEnumStrapInventoryPolicyFilterObjectSchema } from './NestedEnumStrapInventoryPolicyFilter.schema'

const nestedenumstrapinventorypolicywithaggregatesfilterSchema = z.object({
  equals: StrapInventoryPolicySchema.optional(),
  in: StrapInventoryPolicySchema.array().optional(),
  notIn: StrapInventoryPolicySchema.array().optional(),
  not: z.union([StrapInventoryPolicySchema, z.lazy(() => NestedEnumStrapInventoryPolicyWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapInventoryPolicyFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapInventoryPolicyFilterObjectSchema).optional()
}).strict();
export const NestedEnumStrapInventoryPolicyWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapInventoryPolicyWithAggregatesFilter> = nestedenumstrapinventorypolicywithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapInventoryPolicyWithAggregatesFilter>;
export const NestedEnumStrapInventoryPolicyWithAggregatesFilterObjectZodSchema = nestedenumstrapinventorypolicywithaggregatesfilterSchema;

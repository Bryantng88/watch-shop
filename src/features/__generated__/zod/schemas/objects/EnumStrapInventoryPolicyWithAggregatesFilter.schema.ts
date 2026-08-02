import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryPolicySchema } from '../enums/StrapInventoryPolicy.schema';
import { NestedEnumStrapInventoryPolicyWithAggregatesFilterObjectSchema as NestedEnumStrapInventoryPolicyWithAggregatesFilterObjectSchema } from './NestedEnumStrapInventoryPolicyWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStrapInventoryPolicyFilterObjectSchema as NestedEnumStrapInventoryPolicyFilterObjectSchema } from './NestedEnumStrapInventoryPolicyFilter.schema'

const makeSchema = () => z.object({
  equals: StrapInventoryPolicySchema.optional(),
  in: StrapInventoryPolicySchema.array().optional(),
  notIn: StrapInventoryPolicySchema.array().optional(),
  not: z.union([StrapInventoryPolicySchema, z.lazy(() => NestedEnumStrapInventoryPolicyWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapInventoryPolicyFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapInventoryPolicyFilterObjectSchema).optional()
}).strict();
export const EnumStrapInventoryPolicyWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumStrapInventoryPolicyWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapInventoryPolicyWithAggregatesFilter>;
export const EnumStrapInventoryPolicyWithAggregatesFilterObjectZodSchema = makeSchema();

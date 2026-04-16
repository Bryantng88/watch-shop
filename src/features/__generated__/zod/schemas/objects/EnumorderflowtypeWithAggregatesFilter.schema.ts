import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderFlowTypeSchema } from '../enums/OrderFlowType.schema';
import { NestedEnumOrderFlowTypeWithAggregatesFilterObjectSchema as NestedEnumOrderFlowTypeWithAggregatesFilterObjectSchema } from './NestedEnumOrderFlowTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumOrderFlowTypeFilterObjectSchema as NestedEnumOrderFlowTypeFilterObjectSchema } from './NestedEnumOrderFlowTypeFilter.schema'

const makeSchema = () => z.object({
  equals: OrderFlowTypeSchema.optional(),
  in: OrderFlowTypeSchema.array().optional(),
  notIn: OrderFlowTypeSchema.array().optional(),
  not: z.union([OrderFlowTypeSchema, z.lazy(() => NestedEnumOrderFlowTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderFlowTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderFlowTypeFilterObjectSchema).optional()
}).strict();
export const EnumOrderFlowTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumOrderFlowTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumOrderFlowTypeWithAggregatesFilter>;
export const EnumOrderFlowTypeWithAggregatesFilterObjectZodSchema = makeSchema();

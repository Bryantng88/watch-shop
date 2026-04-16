import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderFlowTypeSchema } from '../enums/OrderFlowType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumOrderFlowTypeFilterObjectSchema as NestedEnumOrderFlowTypeFilterObjectSchema } from './NestedEnumOrderFlowTypeFilter.schema'

const nestedenumorderflowtypewithaggregatesfilterSchema = z.object({
  equals: OrderFlowTypeSchema.optional(),
  in: OrderFlowTypeSchema.array().optional(),
  notIn: OrderFlowTypeSchema.array().optional(),
  not: z.union([OrderFlowTypeSchema, z.lazy(() => NestedEnumOrderFlowTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderFlowTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderFlowTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumOrderFlowTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumOrderFlowTypeWithAggregatesFilter> = nestedenumorderflowtypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumOrderFlowTypeWithAggregatesFilter>;
export const NestedEnumOrderFlowTypeWithAggregatesFilterObjectZodSchema = nestedenumorderflowtypewithaggregatesfilterSchema;

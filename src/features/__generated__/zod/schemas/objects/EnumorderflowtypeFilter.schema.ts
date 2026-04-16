import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderFlowTypeSchema } from '../enums/OrderFlowType.schema';
import { NestedEnumOrderFlowTypeFilterObjectSchema as NestedEnumOrderFlowTypeFilterObjectSchema } from './NestedEnumOrderFlowTypeFilter.schema'

const makeSchema = () => z.object({
  equals: OrderFlowTypeSchema.optional(),
  in: OrderFlowTypeSchema.array().optional(),
  notIn: OrderFlowTypeSchema.array().optional(),
  not: z.union([OrderFlowTypeSchema, z.lazy(() => NestedEnumOrderFlowTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumOrderFlowTypeFilterObjectSchema: z.ZodType<Prisma.EnumOrderFlowTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumOrderFlowTypeFilter>;
export const EnumOrderFlowTypeFilterObjectZodSchema = makeSchema();

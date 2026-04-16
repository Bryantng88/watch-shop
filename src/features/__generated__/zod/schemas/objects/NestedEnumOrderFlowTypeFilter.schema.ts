import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderFlowTypeSchema } from '../enums/OrderFlowType.schema'

const nestedenumorderflowtypefilterSchema = z.object({
  equals: OrderFlowTypeSchema.optional(),
  in: OrderFlowTypeSchema.array().optional(),
  notIn: OrderFlowTypeSchema.array().optional(),
  not: z.union([OrderFlowTypeSchema, z.lazy(() => NestedEnumOrderFlowTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumOrderFlowTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumOrderFlowTypeFilter> = nestedenumorderflowtypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumOrderFlowTypeFilter>;
export const NestedEnumOrderFlowTypeFilterObjectZodSchema = nestedenumorderflowtypefilterSchema;

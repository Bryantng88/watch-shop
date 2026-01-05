import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { shipmentstatusSchema } from '../enums/shipmentstatus.schema';
import { NestedEnumshipmentstatusWithAggregatesFilterObjectSchema as NestedEnumshipmentstatusWithAggregatesFilterObjectSchema } from './NestedEnumshipmentstatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumshipmentstatusFilterObjectSchema as NestedEnumshipmentstatusFilterObjectSchema } from './NestedEnumshipmentstatusFilter.schema'

const makeSchema = () => z.object({
  equals: shipmentstatusSchema.optional(),
  in: shipmentstatusSchema.array().optional(),
  notIn: shipmentstatusSchema.array().optional(),
  not: z.union([shipmentstatusSchema, z.lazy(() => NestedEnumshipmentstatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumshipmentstatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumshipmentstatusFilterObjectSchema).optional()
}).strict();
export const EnumshipmentstatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumshipmentstatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumshipmentstatusWithAggregatesFilter>;
export const EnumshipmentstatusWithAggregatesFilterObjectZodSchema = makeSchema();

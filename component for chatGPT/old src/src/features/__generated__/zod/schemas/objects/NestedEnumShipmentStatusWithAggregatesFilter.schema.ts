import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentStatusSchema } from '../enums/ShipmentStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumShipmentStatusFilterObjectSchema as NestedEnumShipmentStatusFilterObjectSchema } from './NestedEnumShipmentStatusFilter.schema'

const nestedenumshipmentstatuswithaggregatesfilterSchema = z.object({
  equals: ShipmentStatusSchema.optional(),
  in: ShipmentStatusSchema.array().optional(),
  notIn: ShipmentStatusSchema.array().optional(),
  not: z.union([ShipmentStatusSchema, z.lazy(() => NestedEnumShipmentStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumShipmentStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumShipmentStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumShipmentStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumShipmentStatusWithAggregatesFilter> = nestedenumshipmentstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumShipmentStatusWithAggregatesFilter>;
export const NestedEnumShipmentStatusWithAggregatesFilterObjectZodSchema = nestedenumshipmentstatuswithaggregatesfilterSchema;

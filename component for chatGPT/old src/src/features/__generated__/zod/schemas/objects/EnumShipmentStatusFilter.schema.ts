import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentStatusSchema } from '../enums/ShipmentStatus.schema';
import { NestedEnumShipmentStatusFilterObjectSchema as NestedEnumShipmentStatusFilterObjectSchema } from './NestedEnumShipmentStatusFilter.schema'

const makeSchema = () => z.object({
  equals: ShipmentStatusSchema.optional(),
  in: ShipmentStatusSchema.array().optional(),
  notIn: ShipmentStatusSchema.array().optional(),
  not: z.union([ShipmentStatusSchema, z.lazy(() => NestedEnumShipmentStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumShipmentStatusFilterObjectSchema: z.ZodType<Prisma.EnumShipmentStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumShipmentStatusFilter>;
export const EnumShipmentStatusFilterObjectZodSchema = makeSchema();

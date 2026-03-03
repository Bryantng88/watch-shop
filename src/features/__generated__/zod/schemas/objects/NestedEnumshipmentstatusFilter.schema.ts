import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentStatusSchema } from '../enums/ShipmentStatus.schema'

const nestedenumshipmentstatusfilterSchema = z.object({
  equals: ShipmentStatusSchema.optional(),
  in: ShipmentStatusSchema.array().optional(),
  notIn: ShipmentStatusSchema.array().optional(),
  not: z.union([ShipmentStatusSchema, z.lazy(() => NestedEnumShipmentStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumShipmentStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumShipmentStatusFilter> = nestedenumshipmentstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumShipmentStatusFilter>;
export const NestedEnumShipmentStatusFilterObjectZodSchema = nestedenumshipmentstatusfilterSchema;
